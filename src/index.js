import React from 'react';
import { render } from 'react-dom';

import { Paper } from 'material-ui';
import {
  MuiThemeProvider,
  createMuiTheme,
  withTheme
} from 'material-ui/styles';

import {
  SortingState,
  LocalSorting,
  PagingState,
  LocalPaging,
  ColumnOrderState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableView,
  TableHeaderRow,
  PagingPanel,
  DragDropContext
} from '@devexpress/dx-react-grid-material-ui';

import { columns, rows } from './data';

import { ConditionalHighlight } from './conditional-highlight';

const getRowId = row => row.id;
const isSpecialRow = row => row.special;
const isQuiteOld = (row, column) => column.name === 'year' && row.year < 1970;

const App = ({ theme }) => (
  <Paper>
    <Grid columns={columns} rows={rows} getRowId={getRowId}>
      <PagingState defaultPageSize={5} />
      <SortingState
        defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
      />
      <ColumnOrderState defaultOrder={['name', 'artist', 'year']} />
      <LocalSorting />
      <LocalPaging />
      <DragDropContext />
      <TableView allowColumnReordering />
      <ConditionalHighlight
        needsHighlighting={({ row, column }) =>
          isSpecialRow(row) || isQuiteOld(row, column)}
        getHighlightStyle={({ row, column }) =>
          isQuiteOld(row, column)
            ? {
                background: theme.palette.secondary[100],
                color: theme.palette.getContrastText(
                  theme.palette.secondary[100]
                )
              }
            : undefined}
        getHighlightReason={({ row, column }) =>
          isQuiteOld(row, column)
            ? 'This is quite old music!'
            : row.specialReason}
      />
      <TableHeaderRow allowSorting allowDragging />
      <PagingPanel allowedPageSizes={[0, 5, 10, 20]} />
    </Grid>
  </Paper>
);

const ThemedApp = withTheme()(App);

const theme = createMuiTheme();

render(
  <MuiThemeProvider theme={theme}>
    <ThemedApp />
  </MuiThemeProvider>,
  document.getElementById('root')
);
