
import useAxiosAuth from '@/libs/axios/hooks/useAxiosAuth';
import WithAuth from '@/libs/withAuth';
import MainDatePicker from '@/shared/Components/DatePicker/MainDatePicker';
import { Icons } from '@/shared/Components/Icon';
import CustomMultiSelect from '@/shared/Components/Select/CustomMultiSelect';
import { Box, Button, createTheme, Grid, Tab, Tabs, ThemeProvider } from '@mui/material';
import { get } from 'lodash';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tw, { css } from 'twin.macro';
// import ReportTable from '@/shared/Components/ReportTable';
import { numberFormat } from '@/helpers/functions/validation';
import { useLoading } from '@/helpers/hook/useLoading';
import ColumnLineChart from '@/shared/Components/Chart/ColumnLineChart';
import ReportTableDisplay from '@/shared/Components/ReportTableDisplay';
import ReportTableAllDisplay from '@/shared/Components/ReportTableAllDisplay';
import XLSX from 'xlsx-js-style';
import TopSummaryReport from '@/shared/Components/TopSummaryReport';
import planning from './planning';
import machine from './master-data/machine';

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'Prompt',
          fontSize: '16px',
          color: '#0E0E10',
          '&.Mui-selected': {
            color: '#256D85',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            border: 'none',
          },
          '& .MuiOutlinedInput-input': {
            padding: '0',
          },
          '& .MuiInputLabel-outlined': {
            transform: 'translate(0, 5px) scale(1)',
          },
          '& .MuiInputLabel-outlined.Mui-focused': {
            transform: 'translate(14px, -6px) scale(0.75)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
      },
    },
  },
});

function ReportPage() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { factoryId } = get(router, 'query');
  const { data: session } = useSession();
  const currentTab = router.query.tab;
  const [dateSelected, setDateSelected] = useState(moment());
  const [dateRangeSelected, setDateRangeSelected] = useState({ startDate: moment(), endDate: moment() });
  const [lineOptionList, setLineOptionList] = useState([]);
  const [lineSelected, setLineSelected] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [periodsSelected, setPeriodsSelected] = useState('');
  const [currentPeriods, setCurrentPeriods] = useState('');
  const [reportType, setReportType] = useState('graph');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [target, setTarget] = useState(0);
  const [exportRows, setExportRows] = useState([]);
  const [perPage, setPerPage] = useState(99999999);
  const [chartCategory, setChartCategory] = useState([]);
  const [chartDataList, setChartDataList] = useState([]);

  const [dataForChart, setDataForChart] = useState({});
  const [reportData, setReportData] = useState([]);
  const [productOptionList, setProductOptionList] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const { loadingShow, loadingHide } = useLoading();
  const [allData, setAllData] = useState([]);
  const allTime = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  useEffect(() => {
    if (session) {
      getAllReportData();
      fetchLineAll();
      fetchProductAll();
      getTarget();
      fetchAllData();
    }
  }, [session, perPage, dateSelected, lineSelected, productSelected]);

  const newData = [
    { dete: '2024-11-24T17:00:00.000Z', OEE: 154.17 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 94.01 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 56.17 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 51.2 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 84.98 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 76.04 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 95.64 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 64.68 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 48.34 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 107.47 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 159.25 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 96.51 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 111.39 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 57.57 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 72.4 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 66.76 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 65.4 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 0 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 56.39 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 91.72 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 63.92 },
    { dete: '2024-11-24T17:00:00.000Z', OEE: 95.77 },
  ];

  // แปลง 'dete' -> 'date'
  const formattedNewData = newData.map((item) => ({
    date: item.dete,
    OEE: item.OEE,
  }));
  const newEFFData = [
    { dete: '2024-11-24T17:00:00.000Z', EFF: 77.45 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 67.79 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 60.67 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 71.82 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 68.75 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 61.42 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 85.8 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 54.85 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 69.79 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 93.55 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 97.14 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 80.33 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 109.49 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 89.11 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 98.96 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 51.48 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 80.11 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 89.69 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 77.11 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 88.0 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 60.52 },
    { dete: '2024-11-24T17:00:00.000Z', EFF: 87.61 },
  ];
  // แปลง 'dete' -> 'date'
  const formattedNewEFFData = newEFFData.map((item) => ({
    date: item.dete,
    EFF: item.EFF,
  }));

  const newProductionData = [
    { dete: '2024-11-24T17:00:00.000Z', Production: 10688 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 6711 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 5096 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 4453 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 4606 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 9581 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 8580 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 7131 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 5583 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 5613 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 11657 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 4820 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 12044 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 10693 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 4948 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 6950 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 6409 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 6278 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 7171 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 9240 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 4418 },
    { dete: '2024-11-24T17:00:00.000Z', Production: 9654 },
  ];
  // แปลง 'dete' -> 'date'
  const formattedNewProductionData = newProductionData.map((item) => ({
    date: item.dete,
    Production: item.Production,
  }));

  const newDefectData = [
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.96 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.97 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.34 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.37 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.38 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 2 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0.92 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
    { dete: '2024-11-24T17:00:00.000Z', Defect: 0 },
  ];
  // แปลง 'dete' -> 'date'
  const formattedNewDefectData = newDefectData.map((item) => ({
    date: item.dete,
    Defect: item.Defect,
  }));
  const productionallMockData = [
    { data: "1/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12408205", Product: "9-OP25419", PlanLotSize: "10,000", STDTime: "720", Setup: "20", start: "8:00", stop: "16:20", Runtime: "420", GoodCount: "9,269", RejectCount: "103", EFF: "93.72", person: "7", MH: "0", Breakdown: "0" },
    { data: "1/10/2024", Line: "L005", Machine: "ASC-093", MO: "12407604", Product: "9-OP26092", PlanLotSize: "3,800", STDTime: "1050", Setup: "15", start: "16:20", stop: "19:30", Runtime: "95", GoodCount: "1,316", RejectCount: "0", EFF: "34.63", person: "5", MH: "0", Breakdown: "0" },
    { data: "2/10/2024", Line: "L005", Machine: "ASC-093", MO: "12407604", Product: "9-OP26092", PlanLotSize: "1,900", STDTime: "1050", Setup: "20", start: "8:00", stop: "10:00", Runtime: "100", GoodCount: "1,685", RejectCount: "38", EFF: "90.68", person: "5", MH: "0", Breakdown: "0" },
    { data: "2/10/2024", Line: "L005", Machine: "ASC-083,ASC-093", MO: "12406637", Product: "9-OP27415", PlanLotSize: "5,000", STDTime: "720", Setup: "60", start: "10:00", stop: "16:00", Runtime: "180", GoodCount: "3,826", RejectCount: "27", EFF: "77.06", person: "7", MH: "0", Breakdown: "0" },
    { data: "2/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406451", Product: "9-OP25397", PlanLotSize: "3,000", STDTime: "864", Setup: "20", start: "16:00", stop: "19:35", Runtime: "145", GoodCount: "1,135", RejectCount: "0", EFF: "37.83", person: "6", MH: "0", Breakdown: "0" },
    { data: "3/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406451", Product: "9-OP25397", PlanLotSize: "8,400", STDTime: "864", Setup: "45", start: "8:00", stop: "20:00", Runtime: "585", GoodCount: "5,096", RejectCount: "0", EFF: "60.67", person: "6", MH: "0", Breakdown: "0" },
    { data: "4/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406451", Product: "9-OP25397", PlanLotSize: "2,700", STDTime: "864", Setup: "20", start: "8:00", stop: "14:10", Runtime: "290", GoodCount: "2,751", RejectCount: "15", EFF: "102.44", person: "6", MH: "0", Breakdown: "0" },
    { data: "4/10/2024", Line: "L005", Machine: "ASC-093", MO: "12407418", Product: "9-OP26836", PlanLotSize: "1,500", STDTime: "960", Setup: "30", start: "14:10", stop: "16:40", Runtime: "90", GoodCount: "809", RejectCount: "0", EFF: "53.93", person: "6", MH: "0", Breakdown: "0" },
    { data: "4/10/2024", Line: "L005", Machine: "ASC-092", MO: "12407418", Product: "9-OP26836", PlanLotSize: "1,500", STDTime: "960", Setup: "30", start: "14:10", stop: "16:40", Runtime: "90", GoodCount: "809", RejectCount: "0", EFF: "43.90", person: "6", MH: "0", Breakdown: "0" },
    { data: "5/10/2024", Line: "L005", Machine: "ASC-092,ASC093", MO: "12403957", Product: "9-OP25254", PlanLotSize: "5,000", STDTime: "720", Setup: "70", start: "8:00", stop: "14:50", Runtime: "280", GoodCount: "3,879", RejectCount: "17", EFF: "77.92", person: "7", MH: "0", Breakdown: "0" },
    { data: "5/10/2024", Line: "L005", Machine: "ASC-092,ASC093", MO: "12404658", Product: "9-OP25254", PlanLotSize: "1,700", STDTime: "720", Setup: "15", start: "14:50", stop: "17:00", Runtime: "85", GoodCount: "710", RejectCount: "0", EFF: "41.76", person: "7", MH: "0", Breakdown: "0" },
    { data: "11/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406068", Product: "9-OP26481", PlanLotSize: "5,600", STDTime: "1050", Setup: "50", start: "8:00", stop: "13:30", Runtime: "250", GoodCount: "3,507", RejectCount: "0", EFF: "62.63", person: "7", MH: "0", Breakdown: "0" },
    { data: "11/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406069", Product: "9-OP26481", PlanLotSize: "10,000", STDTime: "1050", Setup: "60", start: "13:30", stop: "20:30", Runtime: "360", GoodCount: "6,074", RejectCount: "0", EFF: "60.74", person: "7", MH: "0", Breakdown: "0" },
    { data: "12/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406069", Product: "9-OP26481", PlanLotSize: "2,400", STDTime: "1050", Setup: "10", start: "8:00", stop: "10:00", Runtime: "110", GoodCount: "2,060", RejectCount: "31", EFF: "87.13", person: "7", MH: "0", Breakdown: "0" },
    { data: "12/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406070", Product: "9-OP26481", PlanLotSize: "7,000", STDTime: "1050", Setup: "40", start: "10:00", stop: "17:00", Runtime: "320", GoodCount: "5,974", RejectCount: "0", EFF: "85.34", person: "7", MH: "0", Breakdown: "0" },
    { data: "15/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406070", Product: "9-OP26481", PlanLotSize: "5,000", STDTime: "1050", Setup: "20", start: "8:00", stop: "12:40", Runtime: "200", GoodCount: "3,723", RejectCount: "0", EFF: "74.46", person: "7", MH: "0", Breakdown: "0" },
    { data: "15/10/2024", Line: "L005", Machine: "ASC-092", MO: "12405722", Product: "9-OP26361", PlanLotSize: "8,000", STDTime: "1050", Setup: "25", start: "12:40", stop: "20:00", Runtime: "385", GoodCount: "3,408", RejectCount: "0", EFF: "42.60", person: "6", MH: "0", Breakdown: "0" },
    { data: "16/10/2024", Line: "L005", Machine: "ASC-092", MO: "12405722", Product: "9-OP26361", PlanLotSize: "8,000", STDTime: "1050", Setup: "60", start: "8:00", stop: "20:00", Runtime: "600", GoodCount: "5,583", RejectCount: "0", EFF: "69.79", person: "5", MH: "0", Breakdown: "0" },
    { data: "17/10/2024", Line: "L005", Machine: "ASC-092", MO: "12405722", Product: "9-OP26361", PlanLotSize: "3,000", STDTime: "1050", Setup: "20", start: "8:00", stop: "11:20", Runtime: "180", GoodCount: "3,087", RejectCount: "0", EFF: "102.90", person: "5", MH: "0", Breakdown: "0" },
    { data: "17/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12405721", Product: "9-OP26357", PlanLotSize: "3,000", STDTime: "720", Setup: "30", start: "11:20", stop: "17:00", Runtime: "130", GoodCount: "2,526", RejectCount: "0", EFF: "84.20", person: "5", MH: "0", Breakdown: "0" },
    { data: "18/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12405721", Product: "9-OP26357", PlanLotSize: "12,000", STDTime: "720", Setup: "90", start: "8:00", stop: "19:00", Runtime: "520", GoodCount: "11,657", RejectCount: "0", EFF: "97.14", person: "7", MH: "0", Breakdown: "0" },
    { data: "19/10/2024", Line: "L005", Machine: "บรรจุ", MO: "112400661", Product: "9-OP26504", PlanLotSize: "5,000", STDTime: "720", Setup: "15", start: "8:00", stop: "14:40", Runtime: "355", GoodCount: "3,904", RejectCount: "0", EFF: "78.08", person: "7", MH: "0", Breakdown: "0" },
    { data: "19/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406384", Product: "9-OP28324F1", PlanLotSize: "1,000", STDTime: "960", Setup: "20", start: "14:40", stop: "17:00", Runtime: "90", GoodCount: "916", RejectCount: "0", EFF: "91.60", person: "5", MH: "0", Breakdown: "0" },
    { data: "21/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406384", Product: "9-OP28324F1", PlanLotSize: "8,000", STDTime: "960", Setup: "10", start: "8:00", stop: "16:40", Runtime: "450", GoodCount: "10,410", RejectCount: "0", EFF: "130.13", person: "8", MH: "0", Breakdown: "0" },
    { data: "21/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406416", Product: "9-OP28333F1", PlanLotSize: "3,000", STDTime: "960", Setup: "70", start: "16:40", stop: "20:00", Runtime: "250", GoodCount: "1634", RejectCount: "0", EFF: "54.47", person: "8", MH: "0", Breakdown: "0" },
    { data: "22/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12406416", Product: "9-OP28333F1", PlanLotSize: "12,000", STDTime: "960", Setup: "90", start: "8:00", stop: "19:30", Runtime: "510", GoodCount: "10,693", RejectCount: "0", EFF: "89.11", person: "8", MH: "0", Breakdown: "0" },
    { data: "23/10/2024", Line: "L005", Machine: "ASC-092", MO: "12407505", Product: "9-OP25392", PlanLotSize: "5,000", STDTime: "1050", Setup: "50", start: "8:00", stop: "17:00", Runtime: "430", GoodCount: "4,836", RejectCount: "112", EFF: "98.96", person: "5", MH: "0", Breakdown: "0" },
    { data: "24/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406404", Product: "9-OP283330F1", PlanLotSize: "13,500", STDTime: "960", Setup: "25", start: "8:00", stop: "19:00", Runtime: "575", GoodCount: "6,950", RejectCount: "0", EFF: "51.48", person: "6", MH: "0", Breakdown: "0" },
    { data: "25/10/2024", Line: "L005", Machine: "ASC-092", MO: "12406404", Product: "9-OP283330F1", PlanLotSize: "8,000", STDTime: "960", Setup: "20", start: "8:00", stop: "19:00", Runtime: "580", GoodCount: "6,409", RejectCount: "0", EFF: "80.11", person: "6", MH: "0", Breakdown: "0" },
    { data: "26/10/2024", Line: "L005", Machine: "ASC-093", MO: "12406413", Product: "9-OP28332F1", PlanLotSize: "7,000", STDTime: "1200", Setup: "20", start: "8:00", stop: "17:00", Runtime: "460", GoodCount: "6,278", RejectCount: "0", EFF: "89.69", person: "6", MH: "0", Breakdown: "0" },
    { data: "28/10/2024", Line: "L005", Machine: "ASC-093", MO: "12406413", Product: "9-OP28332F1", PlanLotSize: "8,000", STDTime: "1200", Setup: "45", start: "8:00", stop: "19:00", Runtime: "525", GoodCount: "7,105", RejectCount: "66", EFF: "89.64", person: "8", MH: "0", Breakdown: "0" },
    { data: "28/10/2024", Line: "L005", Machine: "ASC-093", MO: "12405922", Product: "9-OP27339", PlanLotSize: "1,300", STDTime: "1050", Setup: "20", start: "19:00", stop: "20:00", Runtime: "40", GoodCount: "0", RejectCount: "0", EFF: "0", person: "7", MH: "", Breakdown: "0" },
    { data: "29/10/2024", Line: "L005", Machine: "ASC-092", MO: "12405922", Product: "9-OP27339", PlanLotSize: "7,500", STDTime: "1050", Setup: "40", start: "8:00", stop: "15:05", Runtime: "325", GoodCount: "7,426", RejectCount: "0", EFF: "99.01", person: "5", MH: "0", Breakdown: "0" },
    { data: "29/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12405675", Product: "9-OP25805", PlanLotSize: "3,000", STDTime: "864", Setup: "20", start: "15:05", stop: "20:00", Runtime: "325", GoodCount: "1,814", RejectCount: "0", EFF: "60.47", person: "6", MH: "0", Breakdown: "0" },
    { data: "30/10/2024", Line: "L005", Machine: "ASC-092,ASC-093", MO: "12405675", Product: "9-OP25805", PlanLotSize: "7,300", STDTime: "864", Setup: "30", start: "8:00", stop: "17:00", Runtime: "450", GoodCount: "4,418", RejectCount: "0", EFF: "60.52", person: "6", MH: "0", Breakdown: "0" },
    { data: "31/10/2024", Line: "L005", Machine: "ASC-093", MO: "112401458", Product: "9-CP75027", PlanLotSize: "1,000", STDTime: "960", Setup: "25", start: "8:00", stop: "9:40", Runtime: "75", GoodCount: "463", RejectCount: "0", EFF: "46.30", person: "6", MH: "0", Breakdown: "0" },
    { data: "31/10/2024", Line: "L005", Machine: "ASC-093", MO: "112400899", Product: "9-CP75024", PlanLotSize: "4,000", STDTime: "960", Setup: "60", start: "9:40", stop: "14:40", Runtime: "180", GoodCount: "3,921", RejectCount: "0", EFF: "98.03", person: "10", MH: "0", Breakdown: "0" },
    { data: "31/10/2024", Line: "L005", Machine: "ASC-093", MO: "112401448", Product: "9-CP75024", PlanLotSize: "6,019", STDTime: "960", Setup: "30", start: "14:40", stop: "20:00", Runtime: "260", GoodCount: "5,270", RejectCount: "0", EFF: "87.56", person: "10", MH: "0", Breakdown: "0" }
  ];

  const newLossData = [
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 6.36 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 19.5 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 7.1429 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 15.79 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 18.89 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 15.28 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 10.42 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 7.14 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 9.0909 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 13.89 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 14.754 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 7.29 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 10.26 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 15 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 10.417 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 4.1667 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 3.3333 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 4.1667 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 10.32 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 10.0 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 6.25 },
    { dete: '2024-11-24T17:00:00.000Z', LossTime: 18.25 },
  ];
  // แปลง 'dete' -> 'date'
  const formattedNewLossData = newLossData.map((item) => ({
    date: item.dete,
    LossTime: item.LossTime,
  }));

  const getTarget = async () => {
    const { data } = await axiosAuth.get(`/api/factory/${factoryId}`);
    if (data.status === 'SUCCESS') {
      setTarget(parseFloat(data.result.target));
    } else {
      setTarget(0);
    }
  };

  const fetchAllData = async () => {
    try {
      let dataAllList = productionallMockData.map((e) => ({
        planDate: e.data || '',
        name: e.Line || '',
        machine: e.Machine || '',
        mo: e.MO || '',
        productNo: e.Product || '',
        lotSize: e.PlanLotSize !== 0 ? e.PlanLotSize : '-', // แปลง 0 เป็น '-'
        ct: e.STDTime !== 0 ? e.STDTime : '-', // แปลง 0 เป็น '-'
        setUp: e.Setup !== 0 ? e.Setup : '-', // แปลง 0 เป็น '-'
        shiftStart: e.start || '',
        shiftEnd: e.stop || '',
        allTime: e.Runtime !== 0 ? e.Runtime : '-', // แปลง 0 เป็น '-'
        totalCount: e.GoodCount !== 0 ? e.GoodCount : '-', // แปลง 0 เป็น '-'
        totalDefect: e.RejectCount !== 0 ? e.RejectCount : '-', // แปลง 0 เป็น '-'
        eff: e.EFF && parseFloat(e.EFF) !== 0 ? parseFloat(e.EFF).toFixed(2) : '-', // แปลง 0 เป็น '-'
        manPower: e.person !== 0 ? e.person : '-', // แปลง 0 เป็น '-'
        pcsPerHour: e.MH !== 0 ? e.MH : '-', // แปลง 0 เป็น '-'
        breakdown: e.Breakdown !== 0 ? e.Breakdown : '-', // แปลง 0 เป็น '-'
        NB: e.Remark || '', // กรณีที่มีหมายเหตุ
      }));

      // จัดเรียงตามวันที่
      dataAllList.sort((a, b) => moment(a.planDate, 'DD-MM-YYYY').isBefore(moment(b.planDate, 'DD-MM-YYYY')) ? -1 : 1);

      // จัดการให้แสดงวันที่เดียวกันในแถวเดียว
      let seenDates = new Set();
      dataAllList = dataAllList.map((item) => {
        if (seenDates.has(item.planDate)) {
          item.planDate = ''; // ซ่อนวันที่เดิม
        } else {
          seenDates.add(item.planDate);
        }
        return item;
      });

      setAllData(dataAllList); // อัปเดต state
    } catch (error) {
      console.error('Error processing mock data:', error);
    }
  };
  // const fetchAllData = async () => {
  //   const startDate = dateSelected
  //     ? moment(dateSelected).startOf('month').format('YYYY-MM-DD')
  //     : moment().startOf('month').format('YYYY-MM-DD');
  //   const endDate = dateSelected
  //     ? moment(dateSelected).endOf('month').format('YYYY-MM-DD')
  //     : moment().endOf('month').format('YYYY-MM-DD');
  //   try {
  //     const [response1, response2] = await Promise.all([
  //       axiosAuth.post(`/api/factory/${factoryId}/planning/search`, {
  //         perPage,
  //         startDate,
  //         endDate,
  //       }),
  //       axiosAuth.post(`/api/factory/${factoryId}/dashboard/indexProduction`, {
  //         perPage,
  //         startDate,
  //         endDate,
  //       }),
  //     ]);
  //     const data1 = response1.data.result;
  //     const data2 = response2.data.result;
  //     const combinedData = data1.filter(item1 => {
  //       const match = data2.find(item2 => item2.id === item1.id && item1.line?.id === item2.line?.id);

  //       if (match) {
  //         match.line = match.line || {};
  //         match.line.lineMachine = match.line.lineMachine || [];
  //         match.line.lineMachine[0] = match.line.lineMachine[0] || {};
  //         match.line.lineMachine[0].machine = match.line.lineMachine[0].machine || {};
  //         match.line.lineMachine[0].machine.name = item1.line?.lineMachine?.[0]?.machine?.name;
  //       }
  //       return match;
  //     });
  //     // console.log('Combined Data:', data2);
  //     if (data2.length > 0) {
  //       let dataAllList = data2.map((e) => {
  //         return {
  //           planDate: moment(e.planDate).format('DD-MM-YYYY'),
  //           name: e.line?.name || '',
  //           machine: e.line?.lineMachine?.[0]?.machine?.name || '',
  //           mo: e.mo || '',
  //           productNo: e.product?.productNo || '',
  //           lotSize: e.lotSize || '',
  //           ct: e.product?.ct || '',
  //           setUp: e.setUp || '',
  //           shiftStart: e.shift?.[0]?.shiftStart || '',
  //           shiftEnd: e.shift?.[0]?.shiftEnd || '',
  //           allTime: e.shift?.[0]?.shiftStart && e.shift?.[0]?.shiftEnd
  //             ? moment(e.shift[0].shiftEnd, 'HH:mm').diff(moment(e.shift[0].shiftStart, 'HH:mm'), 'minutes')
  //             : '',
  //           totalCount: e.totalCount || '',
  //           // defect: e.planningDefect?.[0]?.amount || '',
  //           totalDefect: e.totalDefect || '',
  //           eff: e.eff ? parseFloat(e.eff).toFixed(2) : '',
  //           manPower: e.product?.manPower || '',
  //           pcsPerHour: e.pcsPerHour || '',
  //           breakdown: e.breakdown || '',
  //           NB: e.NB || '',
  //         };
  //       });
  //       dataAllList.sort((a, b) => moment(a.planDate, 'DD-MM-YYYY').isBefore(moment(b.planDate, 'DD-MM-YYYY')) ? -1 : 1);
  //       let seenDates = new Set();
  //       dataAllList = dataAllList.map(item => {
  //         if (seenDates.has(item.planDate)) {
  //           item.planDate = '';
  //         } else {
  //           seenDates.add(item.planDate);
  //         }
  //         return item;
  //       });
  //       setAllData(dataAllList);
  //     } else {
  //       console.error('No matching data found in combinedData');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  const fetchLineAll = async () => {
    const startDate = dateSelected ? moment(dateSelected).startOf('month').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');
    const endDate = dateSelected ? moment(dateSelected).endOf('month').format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD');

    const { data } = await axiosAuth.post(`/api/factory/${factoryId}/dashboard/linePlanning`, {
      startDate,
      endDate,
    });
    if (data.status === 'SUCCESS') {
      let lines = data.result.map((e) => {
        return { value: e.id, name: e.name };
      });
      setLineOptionList(lines);
    }
  };

  const fetchProductAll = async () => {
    const { data } = await axiosAuth.get(`/api/factory/${factoryId}/product/getProduct`);

    if (data.status === 'SUCCESS') {
      let dataList = data.result.map((e) => {
        return { value: e.id, name: e.productNo };
      });
      setProductOptionList(_.orderBy(dataList, 'name', 'asc'));
    }
  };

  const setHeadTable = (dateFilter) => {
    const NoOfDays = dateFilter ? moment(dateFilter, 'YYYY-MM-DD').daysInMonth() : moment().daysInMonth();
    let columns = [
      { id: 'line', value: 'Line', align: 'center', minWidth: '70px' },
      { id: 'value', value: '', align: 'center', minWidth: '122px', border: '1px solid #313131' },
    ];
    for (let i = 0; i < NoOfDays; i++) {
      columns.push({ id: `day_${i + 1}`, value: i + 1, align: 'center', minWidth: 44, border: '1px solid #313131' });
    }
    setColumns(columns);
  };

  const handleTabChange = (event, newValue) => {
    router.query.tab = newValue;
    router.push(router);
    setRows([]);
    setExportRows([]);
    setHeadTable([]);
    setLineSelected([]);
    setDateSelected(moment());
    setProductSelected([]);
  };
  const handleDateChange = (value, type) => {
    if (type === 'range') {
      setDateRangeSelected(value);
    } else {
      setDateSelected(value);
    }
    setLineSelected([]);
  };

  const handleReport = (e) => {
    if (e === 'graph') {
      setReportType(e);
    } else {
    }
  };

  const handleSelectFilter = (val, target) => {
    switch (target) {
      case 'line':
        setLineSelected(val);
        break;
      case 'product':
        setProductSelected(val);
        break;
      default:
        break;
    }
  };

  const handleDownloadImage = async () => {
    const chartInstance = window.Apex._chartInstances.find((chart) => chart.id === 'column-line-chart');
    const base64 = await chartInstance.chart.dataURI();
    const downloadLink = document.createElement('a');
    downloadLink.href = base64.imgURI;
    downloadLink.download = `report-${currentTab}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const generateMergeRanges = (data) => {
    let mergeRanges = [];
    let start = null;

    for (let i = 1; i < data.length; i++) {

      if (start === null) {
        start = i;
      }

      if (data[i][0] !== data[start][0] || i === data.length - 1) {
        if (i === data.length - 1 && data[i][0] === data[start][0]) {

          i++;
        }
        if (i - start > 1) {

          mergeRanges.push({ s: { r: start, c: 0 }, e: { r: i - 1, c: 0 } });
        }
        start = i;
      }
    }

    return mergeRanges;
  };
  // ฟังก์ชันสำหรับแปลงข้อมูลเป็น ArrayBuffer
  // ฟังก์ชัน s2ab ใหม่ (เปลี่ยนชื่อ)
  const s2abForCombinedExport = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const handleExportExcel = async () => {
    // const header = columns.map((e) => e.value);
    // const data = [header, ...exportRows];

    const header = [moment(dateSelected).format('MMMM YYYY')];
    const data = [header, ...reportData[currentTab]];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // ws['!merges'] = generateMergeRanges(data);
    const numberOfColumns = reportData[currentTab][0].length;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numberOfColumns - 1 } }, // Merge from A1 to B1
      ...generateMergeRanges(data), // Other merges if needed
    ];

    // Apply center alignment to all cells including merged ones
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) ws[cell_ref] = { t: 's', v: '' }; // Ensure the cell exists

        if (!ws[cell_ref].s) ws[cell_ref].s = {}; // Initialize style object if it doesn't exist
        ws[cell_ref].s.alignment = { horizontal: 'center', vertical: 'center' };
        if (R === 0) {
          ws[cell_ref].s = {
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
            font: {
              bold: true,
            },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook to a blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `import-${currentTab}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  if (router && !currentTab) {
    router.query.tab = 'oee';
    router.push(router);
  }

  const getAllReportData = async () => {
    loadingShow();
    const dateForSearch = moment(dateSelected).format('YYYY-MM-DD');

    await axiosAuth
      .post(`/api/factory/${factoryId}/report/getAllReport`, { date: dateForSearch, ids: lineSelected, productIds: productSelected })
      .then((res) => {
        loadingHide();
        const { data } = res;

        if (data?.result) {
          const { dataResult, defectHeader, breakdownHeader, planning, lossTime } = data.result;
          mapData(dataResult, defectHeader, breakdownHeader);
          mapSummaryData(planning, defectHeader, lossTime);
        } else {
          setDataForChart([]);
          setChartCategory([]);
          setReportData([]);
          setSummaryData({ oee: [], eff: [], production: [], defect: [], lossTime: [] });
        }
      })
      .catch((err) => {
        loadingHide();
        console.log('getAllReportData fail', err);
      });
  };

  const getTopElements = (data, key, topN) => {
    // Sort the array in descending order based on the specified key (either 'oee' or 'eff')
    const sortedData = [...data].sort((a, b) => b[key] - a[key]);

    // Return the top N elements
    return sortedData.slice(0, topN);
  };

  const mapSummaryData = (planning, defectHeader, lossTime) => {
    const topData = {
      oee: getTopElements(planning, 'oee', 3),
      eff: getTopElements(planning, 'eff', 10),
      production: getTopElements(planning, 'production', 10),
      defect: getTopElements(defectHeader, 'percent', 10),
      lossTime: getTopElements(lossTime, 'percent', 3),
    };
    setSummaryData(topData);
  };

  const mapData = (dataResult, defectHeader, breakdownHeader) => {
    // ใช้ข้อมูลใหม่แทนที่ข้อมูล OEE และ EFF
    const updatedDataResult = dataResult.map((item, index) => {
      const newOEEData = formattedNewData[index]; // ข้อมูล OEE ใหม่
      const newEFFData = formattedNewEFFData[index]; // ข้อมูล EFF ใหม่
      const newProductionData = formattedNewProductionData[index]; // ข้อมูล EFF ใหม่
      const newDefectData = formattedNewDefectData[index]; // ข้อมูล EFF ใหม่
      const newLossData = formattedNewLossData[index]; // ข้อมูล EFF ใหม่
      return {
        ...item,
        oee: newOEEData ? newOEEData.OEE : item.oee, // แทนค่า OEE
        eff: newEFFData ? newEFFData.EFF : item.eff, // แทนค่า EFF
        production: newProductionData ? newProductionData.Production : item.production, // แทนค่า EFF
        defect: newDefectData ? newDefectData.Defect : item.defect, // แทนค่า EFF
        lossTime: newLossData ? newLossData.LossTime : item.lossTime, // แทนค่า EFF
      };
    });

    const dayList = updatedDataResult.map((e) => e.day);

    const generateChartData = (name, valueList) => [
      {
        name,
        type: 'bar',
        data: valueList,
      },
      {
        name,
        type: 'line',
        data: valueList,
      },
    ];

    const chartData = {
      oee: generateChartData(
        'OEE',
        updatedDataResult.map((e) => e.oee) // ใช้ค่า OEE ใหม่ในกราฟ
      ),
      eff: generateChartData(
        'EFF',
        updatedDataResult.map((e) => e.eff)
      ),
      production: generateChartData(
        'Production',
        updatedDataResult.map((e) => e.production)
      ),
      defect: generateChartData(
        'Defect',
        updatedDataResult.map((e) => e.defect)
      ),
      lossTime: generateChartData(
        'Loss Time',
        updatedDataResult.map((e) => e.lossTime)
      ),
    };

    setDataForChart(chartData);
    // console.log('chartData', updatedDataResult);
    setChartCategory(dayList);

    // get defect data
    const defectHeaders = defectHeader.map((e) => e.name);
    const dataDefect = updatedDataResult.map((e) => e.dataDefect);

    const defectKey = defectHeaders.map((k) => {
      return [
        `${k} (%)`,
        ...dataDefect.map((d) => {
          let found = d.find((item) => item.name === k);
          return found && found.percent ? `${numberFormat(found.percent)}` : '-';
        }),
      ];
    });

    // get loss time data
    const breakdownHeaders = breakdownHeader.map((e) => e.key);
    const dataLossTime = updatedDataResult.map((e) => e.dataLossTime);

    const lossTimeKey = breakdownHeaders.map((k) => {
      return [
        `${k} (%)`,
        ...dataLossTime.map((d) => {
          let found = d.find((item) => item.key === k);
          return found && found.percent ? `${numberFormat(found.percent)}` : '-';
        }),
      ];
    });

    mapReportTable(chartData, dayList, defectKey, lossTimeKey);
  };

  const mapReportTable = (chartData, dayList, defectKey, lossTimeKey) => {
    const tabs = [
      { key: 'all', label: 'All Data' },
      { key: 'oee', label: 'OEE (%)' },
      { key: 'eff', label: 'EFF (%)' },
      { key: 'production', label: 'Production (PCS)' },
      { key: 'defect', label: 'Defect' },
      { key: 'lossTime', label: 'Loss Time' },
    ];

    const allTabData = tabs.reduce((acc, tab) => {
      acc[tab.key] = [['', ...dayList]];
      return acc;
    }, {});

    const mapTabData = (tabKey, label) => {
      const tabData = chartData?.[tabKey]?.[0]?.data || [];
      if (tabData.length) {
        const formattedData = tabData.map((e) => `${e ? numberFormat(e) : '-'}`);
        allTabData[tabKey].push([label, ...formattedData]);

        if (tabKey === 'defect') {
          allTabData[tabKey].push(...defectKey);
        } else if (tabKey === 'lossTime') {
          allTabData[tabKey].push(...lossTimeKey);
        }

        if (tabKey !== 'all') {
          allTabData['all'].push([label, ...formattedData]);
        }
      }
    };

    tabs.forEach((tab) => mapTabData(tab.key, tab.key === 'defect' || tab.key === 'lossTime' ? 'Total (%)' : tab.label));
    setReportData(allTabData);

  };
  const handleChartData = () => {
    return dataForChart[currentTab] || [];
  };

  const getYAxisTitle = () => {
    switch (currentTab) {
      case 'oee':
        return 'OEE (%)';
      case 'eff':
        return 'EFF (%)';
      case 'production':
        return 'Product (%)';
      case 'defect':
        return 'Defect (%)';
      case 'lossTime':
        return 'Loss time (%)';
      default:
        return '';
    }
  };

  const getTopSummaryTitle = () => {
    switch (currentTab) {
      case 'oee':
        return 'Top 3 %OEE';
      case 'eff':
        return 'Top 10 %EFF';
      case 'production':
        return 'Top 10 %Product';
      case 'defect':
        return 'Top 10 %Defect';
      case 'lossTime':
        return 'Top 3 %Loss time';
      default:
        return '';
    }
  };

  const renderTopSummary = () => {
    if (reportType !== 'graph') return false;

    const noSelection = (condition) => !condition.length;

    switch (currentTab) {
      case 'oee':
      case 'eff':
        return noSelection(lineSelected);
      case 'production':
        return noSelection(productSelected);
      default:
        return true;
    }
  };
  // แก้ไขในส่วน exportWithCustomHeader() function
  // แก้ไขในส่วน exportWithCustomHeader() function
  const exportWithCustomHeader = () => {
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, size: 16 },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: '4F81BD' } }, // สีพื้นหลัง (ฟ้าเข้ม)
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };
    const subHeaderStyle = {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      fill: { fgColor: { rgb: '9BC2E6' } }, // สีพื้นหลัง (ฟ้าอ่อน)
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };
    const whiteStyle = {
      font: { bold: true, size: 12, color: { rgb: '4D4D4D' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      fill: { fgColor: { rgb: 'FFFFFF' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };

    // เริ่มต้น rows ด้วยหัวตาราง
    const rows = [
      // แถวแรก (กลุ่มหัวตาราง)
      [
        'วันที่',
        'Line',
        'Machine',
        'เลขที่ MO',
        'รหัสสินค้า',
        'แผนผลิต/วัน',
        'STD Time',
        'Set up',
        'การผลิต (นาที)',
        '',
        '',
        'ผลิตได้งานดี',
        'ชิ้นงานเสีย',
        '%EFF',
        'คน',
        'MH',
        'Break Down',
        'หมายเหตุ',
      ],
      // แถวสอง (หัวย่อย)
      ['', '', '', '', '', '', 'PCS/Hr', '(นาที)', 'เวลาเริ่ม', 'เวลาเสร็จ', 'รวม', '', '', '', '', 'pcs/hr', '(นาที)', ''],
    ];
    if (allData && allData.length > 0) {
      allData.forEach((rowData) => {
        const row = Object.keys(rowData).map((key) => rowData[key]);
        rows.push(row);
      });
    }
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
        // Create a worksheet with the rows
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        if (rowIndex >= 2) {
          worksheet[cellAddress].s = whiteStyle; // พื้นหลังขาว
        } else if (rowIndex === 1) {
          worksheet[cellAddress].s = subHeaderStyle; // พื้นหลังฟ้าอ่อน (หัวย่อย)
        } else {
          worksheet[cellAddress].s = headerStyle; // พื้นหลังฟ้าเข้ม (หัวหลัก)
        }
      }
    }
    worksheet['!merges'] = [
      { s: { r: 0, c: 8 }, e: { r: 0, c: 10 } }, // รวม "การผลิต (นาที)"
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // วันที่
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Line
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Machine
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // เลขที่ MO
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // รหัสสินค้า
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // แผนผลิต/วัน
      { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } }, // ผลิตได้งานดี
      { s: { r: 0, c: 12 }, e: { r: 1, c: 12 } }, // ชิ้นงานเสีย
      { s: { r: 0, c: 13 }, e: { r: 1, c: 13 } }, // %EFF
      { s: { r: 0, c: 14 }, e: { r: 1, c: 14 } }, // คน
      { s: { r: 0, c: 17 }, e: { r: 1, c: 17 } }, // หมายเหตุ
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    worksheet['!cols'] = rows[0].map(() => ({ wpx: 100 }));
    XLSX.writeFile(workbook, 'custom_report.xlsx');
  };

  return (
    <>
      <Head>
        <title>Report</title>
        <meta name='keyword' content='' />
      </Head>

      <Box css={[tw`w-[calc(100vw-18vw)] mr-2 `, css``]}>
        <ThemeProvider theme={theme}>
          <div css={tw`flex justify-between items-center`}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#256D85',
                },
              }}
              css={tw`flex-grow`}
            >
              <Tab label='OEE' value='oee' />
              <Tab label='EFF' value='eff' />
              <Tab label='Production' value='production' />
              <Tab label='Defect' value='defect' />
              <Tab label='Loss Time' value='lossTime' />
            </Tabs>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                label={<Icons.table />}
                value='all'
                css={[
                  tw`ml-4 py-2 px-4 flex justify-center items-center`,
                  css`
                    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25);
                    border-radius: 8px;
                    background-color: #256d85;
                    color: #fff;
                  `,
                ]}
                onClick={() => setReportType('table')} // Set to 'table' when clicked
              ></Tab>
            </Tabs>
          </div>
        </ThemeProvider>

        <Box
          css={[
            tw`mt-2 mb-7 py-8 px-[40px]`,
            css`
              box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25);
              border-radius: 25px;
              min-height: 400px;
            `,
          ]}
        >
          <Grid container justifyContent='space-between'>
            <Grid item xs={6} container>
              <MainDatePicker
                isNotForm
                isMonth
                desktopType
                refs={'report'}
                width={'220px'}
                values={dateSelected}
                onDateChange={(val) => handleDateChange(val, 'date')}
              />
              {(currentTab === 'oee' || currentTab === 'eff') && (
                <CustomMultiSelect label={'Line'} options={lineOptionList} value={lineSelected} onSelected={(e) => handleSelectFilter(e, 'line')} />
              )}
              {currentTab === 'production' && (
                <CustomMultiSelect
                  label={'Product NO.'}
                  options={productOptionList}
                  value={productSelected}
                  onSelected={(e) => handleSelectFilter(e, 'product')}
                />
              )}
            </Grid>

            <Grid alignSelf='end'>
              {/* แสดง Icons.graph เฉพาะเมื่อ currentTab ไม่ใช่ 'all' */}
              {currentTab !== 'all' && <Icons.graph active={reportType === 'graph'} onClick={() => setReportType('graph')} />}
              <Icons.table active={reportType === 'table'} onClick={() => setReportType('table')} />

              {reportType === 'graph' ? (
                <a onClick={() => handleDownloadImage()}>
                  <Icons.exportImage />
                </a>
              ) : currentTab === 'all' ? (
                <a onClick={exportWithCustomHeader}>
                  <Icons.exportFile />
                </a>
              ) : (
                <a onClick={() => handleExportExcel()}>
                  <Icons.exportFile />
                </a>
              )}
            </Grid>
          </Grid>

          <Box>
            {reportType === 'graph' ? (
              chartCategory?.length && handleChartData().length ? (
                <ColumnLineChart
                  yaxisTitle={getYAxisTitle()}
                  dataList={handleChartData()}
                  chartCategories={chartCategory}
                  annotations={
                    currentTab === 'production'
                      ? {
                        yaxis: [
                          {
                            y: target,
                            borderColor: '#FF0000',
                            label: {
                              borderColor: 'transparent',
                              style: {
                                color: '#FF0000',
                                background: 'transparent',
                              },
                              text: 'Target',
                            },
                          },
                        ],
                      }
                      : null
                  }
                />
              ) : (
                <div
                  css={[
                    tw`h-[500px]`,
                    css`
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    `,
                  ]}
                >
                  No Data.
                </div>
              )
            ) : currentTab === 'all' ? (
              <ReportTableAllDisplay reportData={allData} /> // Display all data here
            ) : (
              <ReportTableDisplay reportData={reportData[currentTab]} />
            )}
          </Box>
        </Box>

        {renderTopSummary() ? (
          <>
            <div css={tw`text-[#256D85] text-[20px] pl-8`}>{getTopSummaryTitle()}</div>
            <TopSummaryReport currentTab={currentTab} summaryData={summaryData[currentTab]} />
          </>
        ) : null}
      </Box>
    </>
  );
}

export default WithAuth(ReportPage);
