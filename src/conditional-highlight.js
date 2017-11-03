import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

// copied styles and base implementation of the table cell from
// https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid-material-ui/src/templates/table-cell.jsx

const styles = theme => ({
  cell: {
    paddingRight: theme.spacing.unit,
    '& ~ $cell': {
      paddingLeft: theme.spacing.unit
    },
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
    {value}
  </TableCell>
);

ConditionalHighlightCellBase.propTypes = {
  value: PropTypes.any.isRequired,
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
  highlightStyle: PropTypes.object.isRequired,
  column: PropTypes.object
};
ConditionalHighlightCellBase.defaultProps = {
  style: {},
  column: {}
};

const ConditionalHighlightCell = withStyles(styles, {
  name: 'ConditionalHighlightCell'
})(ConditionalHighlightCellBase);

const defaultGetHighlightStyle = () => ({ color: '#ff0000' });

const conditionalHighlight = (
  needsHighlighting,
  getHighlightStyle = defaultGetHighlightStyle
) => ({ value, style, row, column }) => {
  if (needsHighlighting({ value, row, column })) {
    const hs = getHighlightStyle({
      defaultStyle: defaultGetHighlightStyle(),
      value,
      row,
      column
    });
    return (
      <ConditionalHighlightCell
        style={style}
        value={value}
        highlightStyle={hs}
        column={column}
      />
    );
  } else return undefined;
};

export { conditionalHighlight };
