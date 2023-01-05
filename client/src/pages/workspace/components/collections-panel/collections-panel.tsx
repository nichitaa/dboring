import {
  alpha,
  Box,
  BoxProps,
  generateUtilityClasses,
  styled,
  Tooltip,
  useTheme,
} from '@mui/material';
import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  collectionsPanelMaxSizeAtom,
  collectionsPanelMinSizeAtom,
  collectionsPanelSizeAtom,
  currentSelectedQueryDataAtom,
  currentWorkspaceInfoAtom,
} from '../../../../recoil/atoms';
import Tree, { HyperTreeViewProps, useTreeState } from 'react-hyper-tree';
import { useCallback, useEffect, useMemo } from 'react';
import { HyperTreeViewMainProps } from 'react-hyper-tree/dist/types';
import CollectionTreeNode from './tree-nodes/collection-tree-node';
import FolderTreeNode from './tree-nodes/folder-tree-node';
import QueryTreeNode from './tree-nodes/query-tree-node';
import ActionBar from './action-bar';
import SettingsEthernetOutlinedIcon from '@mui/icons-material/SettingsEthernetOutlined';
import { StyledActionIconButton } from '../editor-panel/editor-panel-actions';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface MainProps {
  dimensions: { height: number; width: number };
}

const collectionPanelClasses = generateUtilityClasses('CollectionsPanel', [
  'selectedQuery',
]);
const cls = collectionPanelClasses;

const CollectionsPanel = (props: MainProps) => {
  const theme = useTheme();
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);
  const setCurrentSelectedQueryData = useSetRecoilState(
    currentSelectedQueryDataAtom
  );

  /** clean-up selected query node on workspaceId change */
  useEffect(() => {
    if (currentWorkspaceInfo !== undefined) {
      return () => {
        setCurrentSelectedQueryData(undefined);
      };
    }
  }, [currentWorkspaceInfo]);

  const collectionsData = useMemo(() => {
    if (currentWorkspaceInfo !== undefined) {
      return currentWorkspaceInfo.collections.map((col) => {
        const collectionFolders = col.folders.map((fol) => {
          const folderQueries = fol.queries.map((q) => {
            return { ...q, query: q.name };
          });
          return { ...fol, folder: fol.name, children: folderQueries };
        });
        return { ...col, collection: col.name, children: collectionFolders };
      });
    }
    return [];
  }, [currentWorkspaceInfo]);

  const { maximizePanel } = usePanelResize({
    minSizeAtom: collectionsPanelMinSizeAtom,
    maxSizeAtom: collectionsPanelMaxSizeAtom,
    sizeAtom: collectionsPanelSizeAtom,
  });
  const { required, handlers, instance } = useTreeState({
    data: collectionsData,
    id: 'collections',
    multipleSelect: false,
    defaultOpened: true,
    idKey: 'id',
    childrenKey: 'children',
  });

  const handleMaximizePanel = () => maximizePanel(300);

  const renderNode: HyperTreeViewMainProps['renderNode'] = useCallback(
    ({ node, ...otherNodeProps }) => {
      const isCollection = node.data.collection;
      const isFolder = node.data.folder;
      const isQuery = node.data.query;
      if (isCollection)
        return <CollectionTreeNode node={node} {...otherNodeProps} />;
      if (isFolder) return <FolderTreeNode node={node} {...otherNodeProps} />;
      if (isQuery) return <QueryTreeNode node={node} {...otherNodeProps} />;
      else throw new Error('not collection | folder | query node');
    },
    []
  );

  const handleOnQuerySelectionChange: HyperTreeViewProps['setSelected'] = (
    node,
    selected
  ) => {
    setCurrentSelectedQueryData(node.data);
    handlers.setSelected(node, selected);
  };

  if (props.dimensions.width <= 35) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '4px' }}>
        <Tooltip title={'Expand collections panel'}>
          <StyledActionIconButton
            variant={'info'}
            onClick={handleMaximizePanel}
          >
            <SettingsEthernetOutlinedIcon />
          </StyledActionIconButton>
        </Tooltip>
      </Box>
    );
  }
  return (
    <StyledCollectionPanel>
      <ActionBar />
      <Tree
        {...required}
        {...handlers}
        setSelected={handleOnQuerySelectionChange}
        classes={{
          selectedNodeWrapper: cls.selectedQuery,
        }}
        draggable={false}
        horizontalLineStyles={{
          stroke: theme.palette.primary.main,
          strokeWidth: 1,
          strokeDasharray: '1 4',
        }}
        verticalLineStyles={{
          stroke: theme.palette.primary.main,
          strokeWidth: 0.5,
        }}
        // verticalLineOffset={5}
        // verticalLineTopOffset={-2}
        renderNode={renderNode}
      />
    </StyledCollectionPanel>
  );
};

const StyledCollectionPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
  minWidth: 250,
  [`& .${cls.selectedQuery}`]: {
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
  },
}));

export default CollectionsPanel;
