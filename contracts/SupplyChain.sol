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

    struct ManufacturerData {
        uint256 productId;
        string productName;
        string batchId;
        uint256 quantity;
        string origin;
        uint256 manufacturingDate;
        string qualityStandard;
        address manufacturer;
        uint256 timestamp;
    }

    struct DistributorData {
        uint256 productId;
        uint256 temperature;
        uint256 humidity;
        string location;
        string transportationMode;
        uint256 expectedDeliveryDate;
        address distributor;
        uint256 timestamp;
    }

    struct RetailerData {
        uint256 productId;
        string storageCondition;
        uint256 expiryDate;
        uint256 price;
        string verificationNotes;
        address retailer;
        uint256 timestamp;
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
    mapping(uint256 => ManufacturerData) public manufacturerData;
    mapping(uint256 => DistributorData) public distributorData;
    mapping(uint256 => RetailerData) public retailerData;

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

    // Initialize test roles (for development - only callable by admin once)
    function initializeTestRoles(
        address _manufacturer,
        address _distributor,
        address _retailer
    ) public onlyAdmin {
        roles[_manufacturer] = Role.Manufacturer;
        roles[_distributor] = Role.Distributor;
        roles[_retailer] = Role.Retailer;

        emit RoleAssigned(_manufacturer, Role.Manufacturer);
        emit RoleAssigned(_distributor, Role.Distributor);
        emit RoleAssigned(_retailer, Role.Retailer);
    }

    // ===== SUPPLY CHAIN LOGIC =====

    function createProduct(
        string memory _productName,
        string memory _batchId,
        uint256 _quantity,
        string memory _origin,
        uint256 _manufacturingDate,
        string memory _qualityStandard
    ) public onlyRole(Role.Manufacturer) {
        productCount++;

        products[productCount] = Product({
            id: productCount,
            name: _productName,
            batchId: _batchId,
            owner: msg.sender,
            status: Status.Created,
            createdAt: block.timestamp
        });

        manufacturerData[productCount] = ManufacturerData({
            productId: productCount,
            productName: _productName,
            batchId: _batchId,
            quantity: _quantity,
            origin: _origin,
            manufacturingDate: _manufacturingDate,
            qualityStandard: _qualityStandard,
            manufacturer: msg.sender,
            timestamp: block.timestamp
        });

        productHistory[productCount].push(
            History({
                actor: msg.sender,
                status: Status.Created,
                timestamp: block.timestamp
            })
        );

        emit ProductCreated(productCount, _productName, _batchId, msg.sender);
    }

    function transferToDistributor(
        uint256 _productId,
        address _distributor,
        uint256 _temperature,
        uint256 _humidity,
        string memory _location,
        string memory _transportationMode,
        uint256 _expectedDeliveryDate
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(product.owner == msg.sender, "Not product owner");
        require(
            roles[_distributor] == Role.Distributor,
            "Receiver not distributor"
        );

        product.owner = _distributor;
        product.status = Status.InTransit;

        distributorData[_productId] = DistributorData({
            productId: _productId,
            temperature: _temperature,
            humidity: _humidity,
            location: _location,
            transportationMode: _transportationMode,
            expectedDeliveryDate: _expectedDeliveryDate,
            distributor: _distributor,
            timestamp: block.timestamp
        });

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
        address _retailer,
        string memory _storageCondition,
        uint256 _expiryDate,
        uint256 _price,
        string memory _verificationNotes
    ) public onlyRole(Role.Distributor) {
        Product storage product = products[_productId];

        require(product.owner == msg.sender, "Not product owner");
        require(roles[_retailer] == Role.Retailer, "Receiver not retailer");

        product.owner = _retailer;
        product.status = Status.Delivered;

        retailerData[_productId] = RetailerData({
            productId: _productId,
            storageCondition: _storageCondition,
            expiryDate: _expiryDate,
            price: _price,
            verificationNotes: _verificationNotes,
            retailer: _retailer,
            timestamp: block.timestamp
        });

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

    function getManufacturerData(
        uint256 _productId
    ) public view returns (ManufacturerData memory) {
        return manufacturerData[_productId];
    }

    function getDistributorData(
        uint256 _productId
    ) public view returns (DistributorData memory) {
        return distributorData[_productId];
    }

    function getRetailerData(
        uint256 _productId
    ) public view returns (RetailerData memory) {
        return retailerData[_productId];
    }
}
