function getContractCreator()
    return system.getCreator()
end

abi.register_view(getContractCreator)