import React from 'react';
import { render } from 'react-dom';

import { Paper } from 'material-ui';

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

import { conditionalHighlight } from './conditional-highlight';

const getRowId = row => row.id;
const isSpecialRow = row => row.special;
const isQuiteOld = (row, column) => column.name === 'year' && row.year < 1970;
const conditionalHighlightTemplate = conditionalHighlight(
  ({ row, column }) => isSpecialRow(row) || isQuiteOld(row, column),
  ({ row, column, defaultStyle }) =>
    isQuiteOld(row, column) ? { background: 'green' } : defaultStyle
);

const App = () => (
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
      <TableView
        allowColumnReordering
        tableCellTemplate={conditionalHighlightTemplate}
      />
      <TableHeaderRow allowSorting allowDragging />
      <PagingPanel allowedPageSizes={[0, 5, 10, 20]} />
    </Grid>
  </Paper>
);

render(<App />, document.getElementById('root'));
