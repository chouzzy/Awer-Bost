import { AttachmentIcon, DownloadIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { MicrosoftExcelLogo } from "@phosphor-icons/react";
import { useEffect } from "react";
import { trtSchemaImportOperation } from "../Validation/FormValidator";
import { ValidationError } from "yup";

interface ImportOperation {
    setFilePath: React.Dispatch<React.SetStateAction<string | null>>
    filePath: string
    painel: string
    setWarningAlert: React.Dispatch<React.SetStateAction<string | null>>
}

export function ImportOperation({ setFilePath, filePath, painel, setWarningAlert }: ImportOperation) {



    async function handleFileChange(event) {


        setFilePath(event.target.files[0].path)
        console.log('event.target.files[0]')
        console.log(event.target.files[0].path)



    }

    async function startImportOperation() {

        try {

            await trtSchemaImportOperation.validate({
                filePath,
                painel
            })
        } catch (error) {

            if (error instanceof ValidationError) {
                setWarningAlert(String(error.errors))
            }
            return
        }



        console.log('filePath')
        console.log(filePath)
        console.log('painel')
        console.log(painel)
        await window.ipc.sendExcelPath({ excelPath: filePath, operationType: painel })
    }



    // useEffect(() => {

    //     console.log('filePath')
    //     console.log(filePath)

    // }, [filePath])


    return (

        <Flex flexDir={'column'} gap={2}>

            <Flex p={1} color={'white'} w='100%' alignItems={'center'} justifyContent={'center'}>
                <Flex flexDir={'column'} gap={2}>
                    <Text>Para executar a operação, baixe a planilha modelo no botão abaixo:</Text>
                    <Button
                        // onClick={handleFileChange}
                        bgColor={'#FF5F5E'}
                        color={'white'}
                        _hover={'#33c481'}
                        mx='auto'
                    >
                        <Flex gap={4} alignItems={'center'}>
                            <Text>Download planilha modelo</Text>
                            <Flex gap={1} alignItems={'center'}>

                                <DownloadIcon _hover={{ bgColor: '#21a366', transition: '300ms' }} fontSize={'1.25rem'} />
                            </Flex>

                        </Flex>
                    </Button>
                </Flex>
            </Flex>

            <Flex alignItems={'center'} justifyContent={'center'}>
                <Input
                    id='fileInput'
                    type='file'
                    accept='xlsx'
                    bgColor={'#21a366'}
                    color={'white'}
                    _hover={'#33c481'}
                    onChange={handleFileChange}
                    w='sm'
                    py={1}
                    cursor={'pointer'}
                />
                <Button
                    w='100%'
                    onClick={startImportOperation}
                    bgColor={'#21a366'}
                    color={'white'}
                    _hover={'#33c481'}
                >
                    <Flex gap={4} alignItems={'center'}>
                        Start

                    </Flex>
                </Button>
            </Flex>
        </Flex>
    )
}