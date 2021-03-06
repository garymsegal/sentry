import {Fragment} from 'react';

import ClippedBox from 'sentry/components/clippedBox';
import ErrorBoundary from 'sentry/components/errorBoundary';
import {getMeta} from 'sentry/components/events/meta/metaProxy';
import {t} from 'sentry/locale';
import {EntryRequest} from 'sentry/types/event';
import {defined} from 'sentry/utils';

import RichHttpContentClippedBoxBodySection from './richHttpContentClippedBoxBodySection';
import RichHttpContentClippedBoxKeyValueList from './richHttpContentClippedBoxKeyValueList';

type Props = {
  data: EntryRequest['data'];
};

const RichHttpContent = ({data}: Props) => (
  <Fragment>
    {defined(data.query) && (
      <RichHttpContentClippedBoxKeyValueList
        title={t('Query String')}
        data={data.query}
        meta={getMeta(data, 'query')}
        isContextData
      />
    )}
    {defined(data.fragment) && (
      <ClippedBox title={t('Fragment')}>
        <ErrorBoundary mini>
          <pre>{data.fragment}</pre>
        </ErrorBoundary>
      </ClippedBox>
    )}
    {defined(data.data) && (
      <RichHttpContentClippedBoxBodySection
        data={data.data}
        meta={getMeta(data, 'data')}
        inferredContentType={data.inferredContentType}
      />
    )}
    {defined(data.cookies) && Object.keys(data.cookies).length > 0 && (
      <RichHttpContentClippedBoxKeyValueList
        defaultCollapsed
        title={t('Cookies')}
        data={data.cookies}
        meta={getMeta(data, 'cookies')}
      />
    )}
    {defined(data.headers) && (
      <RichHttpContentClippedBoxKeyValueList
        title={t('Headers')}
        data={data.headers}
        meta={getMeta(data, 'headers')}
      />
    )}
    {defined(data.env) && (
      <RichHttpContentClippedBoxKeyValueList
        defaultCollapsed
        title={t('Environment')}
        data={data.env}
        meta={getMeta(data, 'env')}
      />
    )}
  </Fragment>
);
export default RichHttpContent;
