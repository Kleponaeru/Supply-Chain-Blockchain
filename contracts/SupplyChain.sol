// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    // ===== ENUMS =====
    enum Role {
        None,
        Manufacturer,
        Distributor,
        Retailer
    }

    enum Status {
        Created,
        InTransit,
        Delivered
    }

    // ===== STRUCTS =====
    struct Product {
        uint256 id;
        string name;
        string batchId;
        address owner;
        Status status;
        uint256 createdAt;
    }

    struct History {
        address actor;
        Status status;
        uint256 timestamp;
    }

    // ===== STATE VARIABLES =====
    address public admin;
    uint256 public productCount;

    mapping(address => Role) public roles;
    mapping(uint256 => Product) public products;
    mapping(uint256 => History[]) public productHistory;

    // ===== EVENTS =====
    event RoleAssigned(address indexed user, Role role);
    event ProductCreated(
        uint256 indexed productId,
        string name,
        string batchId,
        address indexed manufacturer
    );
    event OwnershipTransferred(
        uint256 indexed productId,
        address indexed from,
        address indexed to,
        Status status
    );

    // ===== MODIFIERS =====
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Access denied");
        _;
    }

    // ===== CONSTRUCTOR =====
    constructor() {
        admin = msg.sender;
    }

    // ===== ROLE MANAGEMENT =====
    function assignRole(address _user, Role _role) public onlyAdmin {
        roles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }

    // ===== SUPPLY CHAIN LOGIC =====

    function createProduct(
        string memory _name,
        string memory _batchId
    ) public onlyRole(Role.Manufacturer) {
        productCount++;

        products[productCount] = Product({
            id: productCount,
            name: _name,
            batchId: _batchId,
            owner: msg.sender,
            status: Status.Created,
            createdAt: block.timestamp
        });

        productHistory[productCount].push(
            History({
                actor: msg.sender,
                status: Status.Created,
                timestamp: block.timestamp
            })
        );

        emit ProductCreated(productCount, _name, _batchId, msg.sender);
    }

    function transferToDistributor(
        uint256 _productId,
        address _distributor
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(product.owner == msg.sender, "Not product owner");
        require(
            roles[_distributor] == Role.Distributor,
            "Receiver not distributor"
        );

        product.owner = _distributor;
        product.status = Status.InTransit;

        productHistory[_productId].push(
            History({
                actor: msg.sender,
                status: Status.InTransit,
                timestamp: block.timestamp
            })
        );

        emit OwnershipTransferred(
            _productId,
            msg.sender,
            _distributor,
            Status.InTransit
        );
    }

    function transferToRetailer(
        uint256 _productId,
        address _retailer
    ) public onlyRole(Role.Distributor) {
        Product storage product = products[_productId];

        require(product.owner == msg.sender, "Not product owner");
        require(roles[_retailer] == Role.Retailer, "Receiver not retailer");

        product.owner = _retailer;
        product.status = Status.Delivered;

        productHistory[_productId].push(
            History({
                actor: msg.sender,
                status: Status.Delivered,
                timestamp: block.timestamp
            })
        );

        emit OwnershipTransferred(
            _productId,
            msg.sender,
            _retailer,
            Status.Delivered
        );
    }

    // ===== VIEW FUNCTIONS =====

    function getProductHistory(
        uint256 _productId
    ) public view returns (History[] memory) {
        return productHistory[_productId];
    }
}
