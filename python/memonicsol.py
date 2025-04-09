import base58

base58_private_key = "VGvsnNnMrqHiKPsS4gzqbUUApcfARr8RPqvv1mbvUkCq8tYpwcrAfwKPnYPHgXDUBYPHy66sMBpLL8D5ijky15N"
private_key_bytes = base58.b58decode(base58_private_key)

# Print the private key as a 64-byte array
print(list(private_key_bytes))
