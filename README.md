# Decentralized Ride-Sharing Platform

A blockchain-based ride-sharing platform built on Stacks that enables direct peer-to-peer connections between drivers and riders, with transparent pricing and decentralized reputation management.

## Features

### Core Functionality
- **User Registration**: Register as either a driver or rider with unique profiles
- **Ride Management**: Request, accept, and complete rides
- **Direct Payments**: Peer-to-peer STX payments without intermediaries
- **Rating System**: Transparent reputation system for both drivers and riders
- **Dispute Resolution**: Built-in mechanism for handling disputes

### Smart Contract Features
- Immutable ride history
- Transparent pricing
- Decentralized reputation management
- Secure payment handling
- Role-based access control

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Smart contract development environment
- [Stacks Wallet](https://www.hiro.so/wallet) - For STX transactions
- [Node.js](https://nodejs.org/) (optional) - For running test scripts

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/decentralized-ride-sharing.git
cd decentralized-ride-sharing
```

2. Install Clarinet:
```bash
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin
```

3. Initialize the project:
```bash
clarinet new
```

4. Deploy contracts:
```bash
clarinet deploy
```

## Contract Structure

### Main Components

1. **Users Map**
```clarity
(define-map Users 
    principal 
    {
        name: (string-utf8 50),
        rating: uint,
        total-rides: uint,
        role: (string-utf8 10),
        status: (string-utf8 20)
    }
)
```

2. **Rides Map**
```clarity
(define-map Rides 
    uint 
    {
        driver: (optional principal),
        rider: principal,
        pickup: (string-utf8 100),
        destination: (string-utf8 100),
        fare: uint,
        status: (string-utf8 20),
        timestamp: uint
    }
)
```

3. **Disputes Map**
```clarity
(define-map Disputes
    uint 
    {
        ride-id: uint,
        complainant: principal,
        description: (string-utf8 500),
        status: (string-utf8 20)
    }
)
```

## Usage

### For Riders

1. Register as a rider:
```clarity
(contract-call? .ride-sharing register-user "John Doe" "rider")
```

2. Request a ride:
```clarity
(contract-call? .ride-sharing request-ride "123 Main St" "456 Park Ave" u50000000)
```

3. Complete ride and pay:
```clarity
(contract-call? .ride-sharing complete-ride u1)
```

### For Drivers

1. Register as a driver:
```clarity
(contract-call? .ride-sharing register-user "Jane Smith" "driver")
```

2. Accept a ride:
```clarity
(contract-call? .ride-sharing accept-ride u1)
```

3. Submit rating for rider:
```clarity
(contract-call? .ride-sharing submit-rating u1 u5)
```

### Error Codes

- `ERR-NOT-AUTHORIZED (u1)`: User not authorized for action
- `ERR-USER-EXISTS (u2)`: User already registered
- `ERR-INVALID-ROLE (u3)`: Invalid user role specified
- `ERR-USER-NOT-FOUND (u4)`: User not found in system
- `ERR-INVALID-STATUS (u5)`: Invalid status for operation
- `ERR-RIDE-NOT-FOUND (u6)`: Ride ID not found
- `ERR-INVALID-RATING (u7)`: Rating outside valid range
- `ERR-UNAUTHORIZED (u8)`: Unauthorized operation

## Testing

Run the test suite:
```bash
clarinet test
```

## Security Considerations

1. **Payment Safety**
    - All payments are handled through secure STX transfers
    - Funds are transferred directly between parties
    - No central storage of funds

2. **Access Control**
    - Role-based access control for all functions
    - Status validation for state transitions
    - Principal validation for all operations

3. **Data Validation**
    - Input validation for all function parameters
    - Status checks for state transitions
    - Rating range validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Project Link: [https://github.com/your-username/decentralized-ride-sharing](https://github.com/your-username/decentralized-ride-sharing)
- Developer Email: your-email@example.com

## Acknowledgments

- Stacks blockchain team
- Clarity language developers
- Hiro Systems
- Community contributors
