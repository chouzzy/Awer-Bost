import { ArrowLeftIcon } from "@chakra-ui/icons"
import { Button, Flex, Text } from "@chakra-ui/react"

interface BackButtonProps {
    setProcessFinished: React.Dispatch<React.SetStateAction<boolean>>
}

export function BackButton({setProcessFinished}:BackButtonProps) {
    return (
        <Button
            onClick={() => { setProcessFinished(false) }}
            bgColor={'gray.600'}
            color={'white'}
            _hover={{ bgColor: 'gray.700' }}
        >
            <Flex p={4} gap={2} alignItems={'center'}>
                <ArrowLeftIcon />
                <Text>Voltar</Text>
            </Flex>
        </Button>
    )
}