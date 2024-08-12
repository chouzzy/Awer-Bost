Sub FiltrarEExportarDados()

    ' Defina As variáveis
    Dim abaOrigem As Worksheet
    Dim abaDestino As Worksheet
    Dim ultimaLinhaOrigem As Long
    Dim ultimaColunaOrigem As Long
    Dim linhaDestino As Long
    Dim colunaDestino As Long
    Dim criterioFiltro As String
    Dim celulaOrigem As Range
    Dim celulaDestino As Range

    Dim nomeNovaAba As String

    ' Defina As abas de origem e destino
    Set abaOrigem = ThisWorkbook.Worksheets("Tab1") ' Altere o nome da aba de origem

    ' Obtenha a última linha e coluna da aba de origem
    ultimaLinhaOrigem = abaOrigem.Cells(Rows.Count, 1).End(xlUp).Row
    ultimaColunaOrigem = abaOrigem.Cells(1, Columns.Count).End(xlToLeft).Column

    ' Defina a linha inicial de destino
    linhaDestino = 1 ' Ajuste a linha inicial de destino, se necessário

    ' Defina a coluna inicial de destino
    colunaDestino = 1 ' Ajuste a coluna inicial de destino, se necessário


    Dim colunaValoresUnicos As Long
    colunaValoresUnicos = 8 ' Altere para o índice da coluna que contém valores únicos (A=1, B=2, etc.)


    ' Obtenha o intervalo de dados na coluna de valores únicos
    Dim intervaloValoresUnicos As Range
    Set intervaloValoresUnicos = abaOrigem.Range("H2:H" & ultimaLinhaOrigem)

    ' Obtenha o intervalo de dados na coluna de valores únicos
    Dim intervaloValoresUnicos2 As Range
    Set intervaloValoresUnicos2 = abaOrigem.Range("G2:G" & ultimaLinhaOrigem)

    ' Obtenha o intervalo de dados na coluna de valores únicos
    Dim intervaloValoresUnicos3 As Range
    Set intervaloValoresUnicos3 = abaOrigem.Range("G2:G" & ultimaLinhaOrigem)

    Dim dicionarioAbas As Object
    Set dicionarioAbas = CreateObject("Scripting.Dictionary")

    Dim dicionarioAbas2 As Object
    Set dicionarioAbas2 = CreateObject("Scripting.Dictionary")

    ' Varra cada valor único na coluna
    Dim valorUnico As Variant
    Dim empresasUnidades As New Collection


    For Each valorUnico In intervaloValoresUnicos
        ' Formate o valor único para o nome da aba
        Dim nomeAbaFormatado As String
        nomeAbaFormatado = Replace(valorUnico, "/", "/") ' Substitua "/" por "-" para nomes de abas válidos
        nomeAbaFormatado = Trim(nomeAbaFormatado) ' Remova espaços em branco antes e depois


        If Not dicionarioAbas.Exists(nomeAbaFormatado) Then

            empresasUnidades.Add nomeAbaFormatado
            dicionarioAbas.Add nomeAbaFormatado, valorUnico

        End If
    Next valorUnico

    Dim areas2 As New Collection
    For Each empresa In empresasUnidades

        Dim index As Integer
        index = 1



        ' Filtra dados da tabela de origem

        abaOrigem.Range("A1:M" & ultimaLinhaOrigem).AutoFilter Field:=8, Criteria1:=empresa

        Dim cellsArea As Range
        Set cellsArea = abaOrigem.Range("A2:M" & ultimaLinhaOrigem).SpecialCells(xlCellTypeVisible)

        For Each cell In cellsArea
            If cell.Column = 7 Then
                'ler um por um, filtrar e colocar num array pra tirar os repetidos e ler

                If Not dicionarioAbas2.Exists(cell.Value) Then

                    areas2.Add cell.Value
                    dicionarioAbas2.Add cell.Value, cell.Value

                End If
            End If
        Next cell

        For Each area In areas2
            Debug.Print area


            Dim nomeEmpresaCurto As String
            nomeEmpresaCurto = Left(empresa, 9) ' Pega os 20 primeiros caracteres de empresa
            nomeAreaCurto = Left(area, 3) ' Pega os 20 primeiros caracteres de empresa

            ' Cria aba nova para colar cada planilha individualmente
            Dim abaRecemCriada As Worksheet
            Set abaRecemCriada = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
            abaRecemCriada.Name = nomeEmpresaCurto & " - " & nomeAreaCurto & " - " & index

            ' Copia e cola dados da tabela de origem
            abaOrigem.Range("A1:M" & ultimaLinhaOrigem).AutoFilter Field:=7, Criteria1:=area
            MsgBox "teste ai"
            abaOrigem.Range("A1:M" & ultimaLinhaOrigem).SpecialCells(xlCellTypeVisible).Copy

            abaRecemCriada.Cells(linhaDestino, colunaDestino).PasteSpecial xlPasteValues

            index = index + 1


        Next area




        Set areas2 = Nothing
        dicionarioAbas2.RemoveAll


    Next empresa


End Sub




