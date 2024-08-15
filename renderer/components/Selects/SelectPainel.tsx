import { FormControl, FormLabel, Select } from "@chakra-ui/react"


interface SelectPainelProps {

    painel:string,
    setPainel:React.Dispatch<React.SetStateAction<string>>
}

export function SelectPainel({painel, setPainel}:SelectPainelProps) {

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
                Selecione o painel
            </FormLabel>

            <Select
                id='#scrape'
                color={'black'}
                bg={'white'}
                _hover={{ bg: 'purple.600', color: 'white' }}
                value={painel}
                onChange={(event) => { setPainel(event.target.value) }}
            >
                <option style={{ color: 'black' }}>{'Selecione'}</option>
                <option style={{ color: 'black' }}>{'Minha pauta'}</option>
                <option style={{ color: 'black' }}>{'Processos arquivados'}</option>
                {/* <option style={{ color: 'black' }}>{'Acervo Geral'}</option> */}
                {/* <option style={{ color: 'black' }}>{'Pendentes de manifestação'}</option> */}
            </Select>
        </FormControl>
    )
}