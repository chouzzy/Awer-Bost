import { FormControl, FormLabel, Flex } from "@chakra-ui/react";
import { MultiSearchButton } from "./assets/MultiSearchButton";
import { SingleSearchButton } from "./assets/SingleSearchButton";

interface SelectOperationProps {
    multiOperation: boolean
    setMultiOperation: React.Dispatch<React.SetStateAction<boolean>>
    isOperationSelected: boolean
    setIsOperationSelected: React.Dispatch<React.SetStateAction<boolean>>
}

interface SelectOperationProps {
}

export function SelectOperation({
    isOperationSelected,
    setIsOperationSelected,
    multiOperation,
    setMultiOperation
}: SelectOperationProps) {

    return (
        <FormControl
            isRequired={true}
        >
            <FormLabel
                fontSize={'0.875rem'}
                fontWeight={'700'}
                letterSpacing={'5%'}
                color={'white'}
            >
                Selecione o tipo de busca
            </FormLabel>

            <Flex justifyContent={'space-between'} gap={8}>
                <SingleSearchButton
                    multiOperation={multiOperation}
                    setMultiOperation={setMultiOperation}
                    isOperationSelected={isOperationSelected}
                    setIsOperationSelected={setIsOperationSelected}
                />
                <MultiSearchButton
                    multiOperation={multiOperation}
                    setMultiOperation={setMultiOperation}
                    isOperationSelected={isOperationSelected}
                    setIsOperationSelected={setIsOperationSelected}
                />
            </Flex>
        </FormControl>
    )
}