import { AudienciaSimplificada, excelDataIdentified, ProcessosArquivadosSimplificado } from "../types/audiencias";
import { ScrapeData } from "../types/generalTypes";
import exceljs from 'exceljs'
import { format } from 'date-fns';
import moment from "moment";

export async function writeMassiveData(
    listOfExcelData: excelDataIdentified[][],
    filePath,
    painel: ScrapeData["painel"],
) {



    switch (painel) {
        case "Minha pauta":
            listOfExcelData.forEach(async (scrapeList, i) => {

                scrapeList.forEach((scrapeData) => {

                    if (!scrapeData.excelData[0].numeroProcesso) {
                        return
                    }

                    const workbook = new exceljs.Workbook();
                    const worksheet = workbook.addWorksheet('Dados da Audiência')


                    const homeDir = require('os').homedir()
                    const desktopDir = `${homeDir}/Desktop`

                    // Definindo os cabeçalhos das colunas
                    worksheet.columns = [
                        { header: 'Usuário', key: 'usuario', width: 15 },
                        { header: 'Número do Processo', key: 'numeroProcesso', width: 25 },
                        { header: 'Tipo de Audiência', key: 'tipoAudiencia', width: 30 },
                        { header: 'Órgão Julgador', key: 'orgaoJulgador', width: 50 },
                        { header: 'Data Inicio', key: 'dataInicio', width: 24 },
                        { header: 'Hora Inicio', key: 'horaInicio', width: 24 },
                        // { header: 'Data Fim', key: 'dataFim', width: 16 },
                        // { header: 'Hora Fim', key: 'horaFim', width: 16 },
                        { header: 'Polo Ativo', key: 'poloAtivo', width: 50 },
                        { header: 'Polo Passivo', key: 'poloPassivo', width: 50 },
                        { header: 'Url Audiencia Virtual', key: 'urlAudienciaVirtual', width: 50 }
                       
                    ];

                    // Preenchendo as células com os dados

                    scrapeData.excelData.forEach((audiencia, index) => {
                        worksheet.getRow(index + 2).values = [
                            audiencia.usuario,
                            audiencia.numeroProcesso,
                            audiencia.tipoAudiencia,
                            audiencia.orgaoJulgador,
                            moment(audiencia.dataInicio).format('DD/MM/YYYY'),
                            moment(audiencia.dataInicio).format('HH:mm'),
                            // moment(audiencia.dataFim).format('DD/MM/YYYY'), 
                            // moment(audiencia.dataFim).format('HH:mm'), 
                            audiencia.poloAtivo,
                            audiencia.poloPassivo,
                            audiencia.urlAudienciaVirtual
                        ];
                    });

                    // Salvando o arquivo Excel (adaptando o caminho do arquivo)
                    const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
                    // await workbook.xlsx.writeFile(`${desktopDir}/audiencias-${formattedDate}.xlsx`);
                    console.log('going to save')
                    setTimeout(async () => {
                        await workbook.xlsx.writeFile(`${filePath}/audiencias-(${(i)})-${scrapeData.identifier.trt}_${scrapeData.identifier.grau}-${formattedDate}.xlsx`);
                    }, 2000)
                })
            })
            
            break;

        case "Processos arquivados":
            console.log('dentro de processos arquivados')
            listOfExcelData.forEach(async (scrapeList, i) => {
                
                console.log('dentro de processos arquivados for each')
                
                scrapeList.forEach((scrapeData) => {
                    
                    console.log('dentro de scrapeList for each')
                    
                    
                    console.log('scrapeData.excelData')
                    console.log(scrapeData.excelData)
                    
                    if (!scrapeData.excelData[0].numeroProcesso) {
                        return
                    }
                    
                    console.log('depois de !scrapeData.excelData[0].numeroProcesso')
                    
                    const workbook = new exceljs.Workbook();
                    const worksheet = workbook.addWorksheet('Dados da Audiência')
                    
                    
                    const homeDir = require('os').homedir()
                    const desktopDir = `${homeDir}/Desktop`
                    
                    // Definindo os cabeçalhos das colunas
                    worksheet.columns = [
                        { header: 'Usuário', key: 'usuario', width: 15 },
                        { header: 'Número do Processo', key: 'numeroProcesso', width: 25 },
                        { header: 'Parte Autora', key: 'nomeParteAutora', width: 25 },
                        { header: 'Parte Reclamante', key: 'nomeParteRe', width: 30 },
                        { header: 'Data Arquivamento', key: 'dataArquivamento', width: 50 }
                    ];
                    
                    console.log('worksheet.columns')
                    // Preenchendo as células com os dados
                    scrapeData.excelData.forEach((processoArquivado, index) => {
                        worksheet.getRow(index + 2).values = [
                            processoArquivado.usuario,
                            processoArquivado.numeroProcesso,
                            processoArquivado.nomeParteAutora,
                            processoArquivado.nomeParteRe,
                            moment(processoArquivado.dataArquivamento).format('DD/MM/YYYY'),
                        ];
                    });
                    
                    console.log('scrapeData.excelData.forEach')
                    // Salvando o arquivo Excel (adaptando o caminho do arquivo)
                    const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
                    // await workbook.xlsx.writeFile(`${desktopDir}/audiencias-${formattedDate}.xlsx`);
                    setTimeout(async () => {
                        await workbook.xlsx.writeFile(`${filePath}/audiencias-(${(i)})-${scrapeData.identifier.trt}_${scrapeData.identifier.grau}-${formattedDate}.xlsx`);
                    }, 2000)
                })
            })

            break;

        default:
            break;
    }




}
