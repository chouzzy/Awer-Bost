import { ArrowLeftIcon, AttachmentIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons"
import { Button, Flex, Text } from "@chakra-ui/react"
import { MicrosoftExcelLogo } from "@phosphor-icons/react"

interface SingleSearchButtonProps {
    multiOperation: boolean
    setMultiOperation: React.Dispatch<React.SetStateAction<boolean>>
    isOperationSelected: boolean
    setIsOperationSelected: React.Dispatch<React.SetStateAction<boolean>>
}



export function SingleSearchButton({
    isOperationSelected,
    setIsOperationSelected,
    multiOperation,
    setMultiOperation
}: SingleSearchButtonProps) {

    return (
        <Button
            w='100%'
            onClick={() => { setMultiOperation(false), setIsOperationSelected(true) }}
            bgColor={
                isOperationSelected ?
                    multiOperation ? 'cyan.600' : '#FF5F5E'
                    :
                    'cyan.600'
            }
            color={'white'}
            _hover={{ bgColor: multiOperation ? 'cyan.400' : '#FF5F5E' }}
        >
            <Flex gap={4} alignItems={'center'}>
                <Text>Busca rápida</Text>
                <Flex gap={1} alignItems={'center'}>

                    <Search2Icon fontSize={'1.25rem'} />
                </Flex>

            </Flex>
        </Button>
    )
}