
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, Button, Dialog, Typography, DialogFooter, Alert } from "@material-tailwind/react";
import { TextField } from "@mui/material";
import { atom, useRecoilState, useRecoilValue } from 'recoil';

type ContractData = {
    id: number;
    name: string;
    code: string;
}

export const addedContractState = atom<ContractData[]>({
    key: 'addedContractState',
    default: [],
});

  
export function AddContracts() {
    const [open, setOpen] = useState(false);
    const [data, setData] =  useRecoilState<ContractData[]>(addedContractState);
    const [selectedContract, setSelectedContract] = useState<ContractData>();
   
    const [contractName, setContractName] = useState("");
    const [contractCode, setContractCode] = useState("");

    const handleContractNameChange = (event: any) => {
        setContractName(event.target.value);
    };

    const handleContractCodeChange = (event: any) => {
        setContractCode(event.target.value);
    };

    const handleClose = () => {
        setContractCode("")
        setContractName("")
        setSelectedContract(null)
        setOpen(false)
    }

    const handleAdd = () => {
        let contracts: ContractData[] = []
        if (selectedContract) {
            contracts = data.map(d => {
                if (d.id === selectedContract.id) {
                    return { id: d.id, name: contractName, code: contractCode }
                }
                return d
            })
        } else contracts = [...data, { id: Math.random(), name: contractName, code: contractCode }]
        
        setData(contracts)
        handleClose()
    }

    const editContract = (contract: ContractData) => {
        setContractCode(contract.code)
        setContractName(contract.name)
        setSelectedContract(contract)
        setOpen(true)
    }

    const deleteContract = (contract: ContractData) => {
        let updatetData = data.filter(d => d.id !== contract.id)
        setData(updatetData)
    }

    return <Card className="h-full max-w-[20rem] w-full bg-white-100 p-4 shadow-lg shadow-blue-gray-900/25 gap-3 overflow-y-scroll">
        <div onClick={() => {setOpen(true)}} className="w-full items-center  bg-green-900 opacity-80 text-white-100 text-base text-center rounded-lg p-3 hover:opacity-75 cursor-pointer" >
            Add Contracts
        </div>
        {data.map((c: ContractData) => <ShowAddedContract contract={c} handleClick={editContract} handleDelete={deleteContract} />)}

        <Dialog open={open} size="md" handler={handleClose} className="bg-white-100 p-7">
            <Typography variant="h4" className="text-green-900 mb-5">
                Add Your Contract
            </Typography>
            <div className="overflow-scroll pt-2">
                <div className="flex flex-col gap-y-5 h-full">
                    <TextField
                        id="outlined-basic"
                        label="Contract Name"
                        color="success"
                        variant="outlined"
                        value={contractName}
                        onChange={handleContractNameChange}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Contract Code"
                        color="success"
                        multiline
                        rows={15}
                        value={contractCode}
                        onChange={handleContractCodeChange}
                    />
                </div>
            </div>
            <DialogFooter className="space-x-2">
                <Button variant="text" color="gray" onClick={handleClose}>
                    cancel
                </Button>
                <Typography className="bg-green-900 text-xs font-bold rounded-lg text-white-100 py-3 px-6 cursor-pointer" onClick={handleAdd}>
                    {!selectedContract ? "ADD CONTRACT" : "SAVE CHANGES"}
                </Typography>
            </DialogFooter>
        </Dialog>
    </Card>
}

type ShowAddedContractProps = {
    contract: ContractData,
    handleClick: (contract: ContractData) => void,
    handleDelete: (contract: ContractData) => void,
}
export function ShowAddedContract({ contract, handleClick, handleDelete }: ShowAddedContractProps) {
    return <div className="bg-green-50 cursor-pointer rounded-lg p-4" onClick={() => handleClick(contract)}>
        <div className="flex justify-between">
            <Typography variant="paragraph" className="mb-1 font-bold self-center">
                {contract.name}
            </Typography>
            <span className="material-icons cursor-pointer text-xl" onClick={(e) => {e.stopPropagation(); handleDelete(contract)}}>
                close
            </span>
        </div>

        <div className="font-normal opacity-80 text-xs max-h-[160px] overflow-y-scroll whitespace-pre-line">
            {contract.code}
        </div>
    </div>
}