import {mountWithTheme} from 'sentry-test/enzyme';

import MetaData from 'sentry/components/events/meta/metaData';
import {withMeta} from 'sentry/components/events/meta/metaProxy';

describe('MetaData', function () {
  const exc = TestStubs.ExceptionWithMeta();

  const proxiedExc = withMeta(exc);

  it('can get meta data', function () {
    const renderProp = jest.fn(() => null);
    mountWithTheme(
      <MetaData object={proxiedExc.exception.values[0]} prop="value">
        {renderProp}
      </MetaData>
    );

    expect(renderProp).toHaveBeenCalledWith(
      'python err A949AE01EBB07300D62AE0178F0944DD21F8C98C err',
      {
        len: 29,
        rem: [['device_id', 'p', 11, 51]],
      }
    );
  });

  it('has the right value', function () {
    expect(proxiedExc.exception.values[0].value).toBe(
      'python err A949AE01EBB07300D62AE0178F0944DD21F8C98C err'
    );
  });
});
