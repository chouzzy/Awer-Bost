import { trtSchema } from "../../components/Validation/FormValidator"
import * as yup from 'yup';


interface HandleSubmitSingleSearchProps {
    singleSearchData: {
        painel: string,
        initialDate: string,
        finalDate: string,
        setWarningAlert: React.Dispatch<React.SetStateAction<string>>,
        username: string,
        password: string,
        trt: string
    }
}

export async function handleSubmitSingleSearch({ singleSearchData }: HandleSubmitSingleSearchProps) {

    const { painel, initialDate, finalDate, setWarningAlert, username, password, trt } = singleSearchData

    if ((painel == "Minha pauta") && (!initialDate || !finalDate)) {
        return setWarningAlert('Insira a data inicial e a data final')
    }


    const initialDateObj = new Date(initialDate)
    const finalDateObj = new Date(finalDate)

    const date = {
        initial: {
            day: initialDateObj.getDate().toString().padStart(2, '0'),
            month: (initialDateObj.getMonth() + 1).toString().padStart(2, '0'),
            year: initialDateObj.getFullYear().toString(),
        },
        final: {
            day: finalDateObj.getDate().toString().padStart(2, '0'),
            month: (finalDateObj.getMonth() + 1).toString().padStart(2, '0'),
            year: finalDateObj.getFullYear().toString(),
        }
    }

    console.log('date')
    console.log(date)
    console.log('date.initial')
    console.log(date.initial)
    console.log('date.final')
    console.log(date.final)

    while(1>0) {

    }

    try {

        await trtSchema.validate({
            username,
            password,
            trt,
            painel
        })

    } catch (error) {

        if (error instanceof yup.ValidationError) {
            setWarningAlert(String(error.errors))
        }
        return
    }

    if (painel != 'Minha pauta' &&
        painel != 'Processos arquivados' &&
        painel != 'Pendentes de manifestação' &&
        painel != 'Acervo Geral') {
        return alert('Erro de seleção, favor contactar o desenvolvedor.')
    }

    window.ipc.scrapeData({
        username,
        password,
        trt,
        painel,
        date
    })
}