import { ExportToCsv } from 'export-to-csv';

export default {
  name: 'ExcelExportMixin',
  data() {
    return {
      options: {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        title: '',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      },
    };
  },
  methods: {
    exportDataToExcel(dataToexport, fileName = 'Excel export') {
      this.options['title'] = fileName
      this.$nextTick(() => {
        const csvExporter = new ExportToCsv(this.options);
        csvExporter.generateCsv(dataToexport);
      });
    },
  },
};
