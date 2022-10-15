import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  StyledNodeIconButton,
  StyledNodeTypography,
  StyledTreeNode,
} from './collection-tree-node';

interface MainProps extends DefaultNodeProps {}

const QueryTreeNode = (props: MainProps) => {
  const { node, onSelect } = props;

  return (
    <StyledTreeNode key={`${node.data.id}_${node.data.query}`} type={'query'}>
      <Box className={'labelWrapper'} onClick={(e) => onSelect(e)}>
        <StyledNodeTypography component={'div'}>
          {node.data.query}
        </StyledNodeTypography>
      </Box>
      {/*TODO: folder menu*/}
      <StyledNodeIconButton>
        <MoreHorizIcon />
      </StyledNodeIconButton>
    </StyledTreeNode>
  );
};

export default QueryTreeNode;
