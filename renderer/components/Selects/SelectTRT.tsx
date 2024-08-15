import { FormControl, FormLabel, Select } from "@chakra-ui/react"
import { TRTMinhaPauta } from "./Options/TRTMinhaPauta"
import { TRTProcessosArquivados } from "./Options/TRTProcessosArquivados"

interface SelectTRTProps {
    trt:string
    setTRT:React.Dispatch<React.SetStateAction<string>>
    painel:string
}

export function SelectTRT({ trt, setTRT, painel }: SelectTRTProps) {

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
                Selecione o TRT
            </FormLabel>

            <Select
                id='#TRT'
                color={'black'}
                bg={'white'}
                _hover={{ bg: 'purple.600', color: 'white' }}
                value={trt}
                onChange={(event) => { setTRT(event.target.value) }}
            >

                {
                    painel == "Minha pauta" ?
                        <TRTMinhaPauta />
                        :
                        ''
                }
                {
                    painel == "Processos arquivados" ?
                        <TRTProcessosArquivados />
                        :
                        ''
                }
            </Select>
        </FormControl>
    )
}