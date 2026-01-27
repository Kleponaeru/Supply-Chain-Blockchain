// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
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

    struct Product {
        uint256 id;
        string name;
        address owner;
        Status status;
    }

    uint256 public productCount;

    mapping(address => Role) public roles;
    mapping(uint256 => Product) public products;

    // ===== EVENTS (IMPORTANT FOR THESIS) =====
    event RoleAssigned(address user, Role role);
    event ProductCreated(uint256 productId, string name);
    event OwnershipTransferred(
        uint256 productId,
        address from,
        address to,
        Status status
    );

    // ===== MODIFIERS =====
    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Access denied");
        _;
    }

    // ===== ROLE MANAGEMENT =====
    function assignRole(address _user, Role _role) public {
        roles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }

    // ===== SUPPLY CHAIN LOGIC =
    function createProduct(
        string memory _name
    ) public onlyRole(Role.Manufacturer) {
        productCount++;

        products[productCount] = Product({
            id: productCount,
            name: _name,
            owner: msg.sender,
            status: Status.Created
        });

        emit ProductCreated(productCount, _name);
    }

    function transferToDistributor(
        uint256 _productId,
        address _distributor
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];
        require(product.owner == msg.sender, "Not owner");

        product.owner = _distributor;
        product.status = Status.InTransit;

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
        require(product.owner == msg.sender, "Not owner");

        product.owner = _retailer;
        product.status = Status.Delivered;

        emit OwnershipTransferred(
            _productId,
            msg.sender,
            _retailer,
            Status.Delivered
        );
    }
}
