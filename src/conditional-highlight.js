import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, Tooltip } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { red } from 'material-ui/colors';

import { PluginContainer, Template } from '@devexpress/dx-react-core';

// copied styles and base implementation of the table cell from
// https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid-material-ui/src/templates/table-cell.jsx

const styles = theme => ({
  cell: {
    paddingRight: theme.spacing.unit,
    // This selector improves indenting of the cell in the demo scenario -
    // the original version doesn't work right if there's only one column
    // in a row rendered using the conditional cell highlight template,
    // because $cell refers to my style instead of the standard style.
    // I'm warned that this selector also comes with issues, but they
    // are not apparent in this demo.
    // This will hopefully change for the better when a final templating
    // approach is implemented.
    '&:not(:first-child)': {
      paddingLeft: theme.spacing.unit
    },
    // '& ~ $cell': {
    //   paddingLeft: theme.spacing.unit
    // },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cellRightAlign: {
    textAlign: 'right'
  }
});

const ConditionalHighlightCellBase = ({
  style,
  value,
  highlightStyle,
  highlightReason,
  classes,
  column
}) => (
  <TableCell
    style={{ ...style, ...highlightStyle }}
    className={classNames({
      [classes.cell]: true,
      [classes.cellRightAlign]: column.align === 'right'
    })}
  >
    {highlightReason ? (
      <Tooltip placement="right" title={highlightReason}>
        <span>{value}</span>
      </Tooltip>
    ) : (
      <span>{value}</span>
    )}
  </TableCell>
);

ConditionalHighlightCellBase.propTypes = {
  value: PropTypes.any.isRequired,
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
  highlightStyle: PropTypes.object.isRequired,
  highlightReason: PropTypes.string,
  column: PropTypes.object
};
ConditionalHighlightCellBase.defaultProps = {
  style: {},
  column: {},
  highlightReason: undefined
};

const ConditionalHighlightCell = withStyles(styles, {
  name: 'ConditionalHighlightCell'
})(ConditionalHighlightCellBase);

const defaultGetHighlightStyle = () => ({ color: red[700] });
const defaultGetHighlightReason = () => undefined;

const transform = p => ({
  row: p.tableRow.row,
  column: p.tableColumn.column,
  value: p.tableRow.row[p.tableColumn.column.name]
});

const ConditionalHighlight = ({
  needsHighlighting,
  getHighlightStyle,
  getHighlightReason
}) => (
  <PluginContainer dependencies={[{ pluginName: 'TableView' }]}>
    <Template
      name="tableViewCell"
      predicate={p =>
        p.tableRow.type === 'data' && needsHighlighting(transform(p))}
    >
      {p => {
        const params = transform(p);
        const hs =
          getHighlightStyle(params) || defaultGetHighlightStyle(params);
        const hr = getHighlightReason(params);
        return (
          <ConditionalHighlightCell
            style={p.style}
            value={params.value}
            highlightStyle={hs}
            highlightReason={hr}
            column={params.column}
          />
        );
      }}
    </Template>
  </PluginContainer>
);

ConditionalHighlight.propTypes = {
  needsHighlighting: PropTypes.func.isRequired,
  getHighlightStyle: PropTypes.func,
  getHighlightReason: PropTypes.func
};

ConditionalHighlight.defaultProps = {
  getHighlightStyle: defaultGetHighlightStyle,
  getHighlightReason: defaultGetHighlightReason
};

export { ConditionalHighlight };
