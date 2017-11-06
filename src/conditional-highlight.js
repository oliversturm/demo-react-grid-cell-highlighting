import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, Tooltip } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { red } from 'material-ui/colors';

import { Getter, PluginContainer } from '@devexpress/dx-react-core';

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

const conditionalHighlight = (
  needsHighlighting,
  getHighlightStyle = defaultGetHighlightStyle,
  getHighlightReason = defaultGetHighlightReason
) => ({ value, style, row, column }) => {
  if (needsHighlighting({ value, row, column })) {
    const hs =
      getHighlightStyle({
        value,
        row,
        column
      }) || defaultGetHighlightStyle();
    const hr =
      getHighlightReason({ value, row, column }) || defaultGetHighlightReason();
    return (
      <ConditionalHighlightCell
        style={style}
        value={value}
        highlightStyle={hs}
        highlightReason={hr}
        column={column}
      />
    );
  } else return undefined;
};

export { conditionalHighlight };

const ConditionalHighlight = ({
  needsHighlighting,
  getHighlightStyle,
  getHighlightReason
}) => (
  <PluginContainer>
    <Getter
      name="tableCellTemplate"
      value={conditionalHighlight(
        needsHighlighting,
        getHighlightStyle,
        getHighlightReason
      )}
    />
  </PluginContainer>
);

ConditionalHighlight.propTypes = {
  needsHighlighting: PropTypes.func.isRequired,
  getHighlightStyle: PropTypes.func,
  getHighlightReason: PropTypes.func
};

export { ConditionalHighlight };
