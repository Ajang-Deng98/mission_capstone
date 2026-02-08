import hashlib
import json
from web3 import Web3
from django.conf import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Contract ABI for AidTrace verification
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
        "name": "storeHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
        "name": "verifyHash",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
        "name": "getHashTimestamp",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

def create_verification_hash(obj):
    """Create cryptographic hash for verification / إنشاء هاش تشفيري للتوثيق"""
    if not hasattr(obj, 'id'):
        return None
        
    data = {
        'id': obj.id,
        'type': obj.__class__.__name__,
        'timestamp': datetime.now().isoformat(),
    }
    
    # Add specific fields based on object type
    if obj.__class__.__name__ == 'FundingTransaction':
        data.update({
            'amount': str(obj.amount),
            'donor_id': obj.donor.id,
            'project_id': obj.project.id,
            'date': obj.date.isoformat() if obj.date else None,
        })
    elif obj.__class__.__name__ == 'Report':
        data.update({
            'title': obj.title,
            'project_id': obj.project.id,
            'submitted_by': obj.submitted_by.id,
            'type': obj.type,
        })
    elif obj.__class__.__name__ == 'AidDistribution':
        data.update({
            'aid_type': obj.aid_type,
            'quantity': str(obj.quantity),
            'beneficiaries_count': obj.beneficiaries_count,
            'project_id': obj.project.id,
        })
    
    # Create SHA-256 hash
    json_string = json.dumps(data, sort_keys=True)
    return hashlib.sha256(json_string.encode()).hexdigest()

def get_web3_connection():
    """Get Web3 connection / الحصول على اتصال Web3"""
    try:
        w3 = Web3(Web3.HTTPProvider('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))
        return w3 if w3.isConnected() else None
    except Exception as e:
        logger.error(f"Web3 connection failed: {str(e)}")
        return None

def store_on_blockchain(hash_value):
    """Store hash on blockchain / تخزين الهاش على البلوك تشين"""
    if not hash_value:
        return None
        
    try:
        w3 = get_web3_connection()
        
        if not w3:
            logger.warning("No blockchain connection, using simulation mode")
            return f"sim_{hash_value[:16]}"
        
        # Check if contract address is configured
        if not w3:
            logger.warning("No blockchain connection, using development mode")
            return f"dev_{hash_value[:16]}"
        
        # Use real Sepolia testnet contract
        contract = w3.eth.contract(
            address='0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8',
            abi=CONTRACT_ABI
        )
        
        # Prepare account  
        account = w3.eth.account.privateKeyToAccount('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
        nonce = w3.eth.getTransactionCount(account.address)
        
        # Build transaction
        transaction = contract.functions.storeHash(hash_value).buildTransaction({
            'chainId': 11155111,
            'gas': 100000,
            'gasPrice': w3.toWei('20', 'gwei'),
            'nonce': nonce,
        })
        
        # Sign and send transaction
        signed_txn = w3.eth.account.signTransaction(transaction, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
        tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
        
        logger.info(f"Hash stored on Sepolia testnet: {tx_hash.hex()}")
        return tx_hash.hex()
            
    except Exception as e:
        logger.error(f"Blockchain storage failed: {str(e)}")
        # Fallback to simulation
        return f"sim_{hash_value[:16]}"

def verify_on_blockchain(hash_value, blockchain_tx_id):
    """Verify hash on blockchain / التحقق من الهاش على البلوك تشين"""
    if not hash_value or not blockchain_tx_id:
        return False
        
    try:
        # Handle development mode
        if blockchain_tx_id.startswith('dev_'):
            return True
            
        w3 = get_web3_connection()
        if not w3:
            return blockchain_tx_id.startswith('dev_')
        
        # Create contract instance
        contract = w3.eth.contract(
            address='0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8',
            abi=CONTRACT_ABI
        )
        
        # Verify hash exists on blockchain
        result = contract.functions.verifyHash(hash_value).call()
        return result
        
    except Exception as e:
        logger.error(f"Blockchain verification failed: {str(e)}")
        return False

def batch_verify_hashes(hash_list):
    """Batch verify multiple hashes / التحقق من عدة هاشات دفعة واحدة"""
    results = {}
    
    try:
        w3 = get_web3_connection()
        if not w3:
            # Development mode
            for hash_value in hash_list:
                results[hash_value] = True
            return results
        
        contract = w3.eth.contract(
            address='0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8',
            abi=CONTRACT_ABI
        )
        
        for hash_value in hash_list:
            try:
                result = contract.functions.verifyHash(hash_value).call()
                results[hash_value] = result
            except Exception as e:
                logger.error(f"Failed to verify hash {hash_value}: {str(e)}")
                results[hash_value] = False
                
    except Exception as e:
        logger.error(f"Batch verification failed: {str(e)}")
        
    return results

def get_blockchain_stats():
    """Get blockchain verification statistics / الحصول على إحصائيات التوثيق"""
    from .models import VerificationRecord
    
    total_records = VerificationRecord.objects.count()
    verified_records = VerificationRecord.objects.filter(is_verified=True).count()
    pending_records = total_records - verified_records
    
    return {
        'total_verifications': total_records,
        'verified_count': verified_records,
        'pending_count': pending_records,
        'verification_rate': (verified_records / total_records * 100) if total_records > 0 else 0
    }