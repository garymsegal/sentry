import {cloneElement} from 'react';
import styled from '@emotion/styled';

import {ChunkType} from 'sentry/types';

import Chunk from './chunk';

type Props = {
  chunks: Array<ChunkType>;
};

const Chunks = ({chunks}: Props) => (
  <ChunksSpan>
    {chunks.map((chunk, key) => cloneElement(<Chunk chunk={chunk} />, {key}))}
  </ChunksSpan>
);

export default Chunks;

const ChunksSpan = styled('span')`
  span {
    display: inline;
  }
`;
