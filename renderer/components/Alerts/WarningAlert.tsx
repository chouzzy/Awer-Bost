import { WarningIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";

interface warningAlertProps {
    warningAlert:string
}

export function WarningAlert({warningAlert}:warningAlertProps) {

    return (
        <Flex mt={4} bg='#FF5F5E' borderRadius={4} color='white' p={2} alignItems={'center'} gap={4}>
            <Flex> <WarningIcon fontSize={24} /> </Flex>
            <Flex> <Text fontSize={'0.875rem'}> {warningAlert} </Text> </Flex>
        </Flex>
    )
}