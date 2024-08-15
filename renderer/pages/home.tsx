import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Flex, Spinner } from '@chakra-ui/react'



import { SaveButton } from '../components/HomeButtons/SaveButton';
import { BackButton } from '../components/HomeButtons/BackButton';

import { Container } from '../components/InheritComponents/Container'
import { DarkModeSwitch } from '../components/InheritComponents/DarkModeSwitch'

import { ImportOperation } from '../components/ImportOperation/ImportOperation';

import { SelectOperation } from '../components/SelectOperation/SelectOperation';

import { PasswordInput } from '../components/HomeInputs/PasswordInput';
import { LoginInput } from '../components/HomeInputs/LoginInput';
import { DateInput } from '../components/HomeInputs/DateInput';

import { SelectTRT } from '../components/Selects/SelectTRT';
import { SelectPainel } from '../components/Selects/SelectPainel';

import { Logo } from '../components/Banners/Logo';
import { trtSchema } from '../components/Validation/FormValidator'
import { WarningAlert } from '../components/Alerts/WarningAlert';
import { StartButtonSingleSearch } from '../components/HomeButtons/StartButtonSingleSearch';
import { handleSubmitSingleSearch } from '../services/SingleSearch';






export default function HomePage() {

  useEffect(() => {
    window.ipc.isLoading(async (value) => {
      setLoading(value)
      setFile(false)
    })
  }, [])

  useEffect(() => {
    window.ipc.loginError(async (value) => {
      setLoading(value)
      setFile(false)
      setWarningAlert("Usuário ou senha inválidos. Por favor, verifique as informações e tente novamente.")
    })
  }, [])

  useEffect(() => {
    window.ipc.processFinished(async (value) => {
      setProcessFinished(true)
    })
  }, [])

  const [file, setFile] = useState(true);

  const [loading, setLoading] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [trt, setTRT] = useState('')
  const [painel, setPainel] = useState('')

  const [initialDate, setInitialDate] = useState('')
  const [finalDate, setFinalDate] = useState('');

  const [warningAlert, setWarningAlert] = useState('');

  const [multiOperation, setMultiOperation] = useState(false);

  const [isOperationSelected, setIsOperationSelected] = useState(false)

  const [filePath, setFilePath] = useState(null);


  const singleSearchData = {
    painel,
    initialDate,
    finalDate,
    setWarningAlert,
    username,
    password,
    trt
  }


  async function saveFilePath() {
    await window.ipc.saveExcel()
  }

  return (
    <React.Fragment>

      <Head>
        <title>B🔍TRT </title>
      </Head>

      <Container
        minHeight="100vh"
        bgImage={'/images/bgs/judge-bg2.png'}
        bgSize={'cover'}
        bgPos={'center'}
        bgRepeat={'no-repeat'}
      >

        <DarkModeSwitch />

        <Flex
          h='100vh'
          w='100vw'
          flexDir={'column'}
          alignItems={'center'}
          pb={8}
        >
          <Logo />
          {
            loading ?
              <Spinner
                my='auto'
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
              :
              <Flex>

                {processFinished ?
                  <Flex gap={2} >
                    <BackButton setProcessFinished={setProcessFinished} />
                    <SaveButton file={file} saveFilePath={saveFilePath} />
                  </Flex>
                  :

                  <Flex
                    flexDir={'column'}
                    gap={1}
                    w={'560px'}
                  >
                    {warningAlert ?
                      <WarningAlert warningAlert={warningAlert} />
                      :
                      ''
                    }

                    {/* // INPUTS DE USO DO TRT */}
                    <Flex
                      w='100%'
                      gap={8}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >

                      {/* INPUT USERNAME, PASSWORD, TRT E SCRAPE */}
                      <Flex
                        gap={4}
                        flexDir={'column'}
                        w='100%'
                      >

                        <SelectOperation
                          multiOperation={multiOperation}
                          setMultiOperation={setMultiOperation}
                          isOperationSelected={isOperationSelected}
                          setIsOperationSelected={setIsOperationSelected}
                        />

                        <SelectPainel painel={painel} setPainel={setPainel} />


                        {isOperationSelected ?
                          <>
                            {
                              multiOperation ?
                                <ImportOperation setFilePath={setFilePath} />
                                :
                                <>
                                  <LoginInput setUsername={setUsername} />
                                  <PasswordInput setPassword={setPassword} />

                                  {
                                    painel != "Selecione" ?
                                      <SelectTRT trt={trt} setTRT={setTRT} painel={painel} />
                                      :
                                      ""
                                  }
                                </>

                            }
                          </>
                          :
                          ''
                        }





                      </Flex>

                    </Flex>

                    {multiOperation ?
                      ''
                      :

                      <>
                        {
                          isOperationSelected ?
                            <>
                              {
                                painel == "Minha pauta" || "Processos arquivados" ?
                                  <>
                                    {/* INPUT DATAS */}
                                    <DateInput setFinalDate={setFinalDate} setInitialDate={setInitialDate} />

                                    {/* BOTÃO START */}
                                    <Flex
                                      flexDir={'column'}
                                      py={4}
                                      gap={4}
                                    >

                                      {/* BOTÃO START */}
                                      <StartButtonSingleSearch singleSearchData={singleSearchData} />

                                      {/* BOTÃO SAVE FILE */}
                                      {
                                        // loading ?
                                        //   ''
                                        //   :
                                        //   <SaveButton file={file} saveFilePath={saveFilePath} />
                                      }
                                    </Flex>
                                  </>
                                  :
                                  ''
                              }
                            </>
                            :
                            ''


                        }
                      </>
                    }




                  </Flex>
                }
              </Flex>
          }
        </Flex>


      </Container>
    </React.Fragment>
  )
}
