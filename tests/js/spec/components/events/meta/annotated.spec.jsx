import {mountWithTheme} from 'sentry-test/enzyme';

import Annotated from 'sentry/components/events/meta/annotated';
import {withMeta} from 'sentry/components/events/meta/metaProxy';

describe('Annotated', () => {
  const mock = jest.fn(() => null);

  const createEvent = (value, {err, rem, chunks} = {}) =>
    withMeta({
      value,
      _meta: {
        value: {
          '': {
            err: err || [],
            rem: rem || [],
            chunks: chunks || [],
          },
        },
      },
    });

  beforeEach(function () {
    mock.mockClear();
  });

  describe('without meta', () => {
    it('renders a string', () => {
      const obj = {
        value: 'foo',
      };
      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );
      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: 'foo',
        })
      );
    });

    it('does not error if prop does not exist on object', () => {
      const obj = {
        value: 'foo',
      };
      mountWithTheme(<Annotated object={obj} objectKey="invalid" />);
    });

    it('renders a number', () => {
      const obj = {
        value: 0,
      };
      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );
      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: 0,
        })
      );
    });

    it('renders a boolean', () => {
      const obj = {
        value: false,
      };
      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );
      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: false,
        })
      );
    });

    it('ignores empty meta data', () => {
      const obj = withMeta({
        value: 'foo',
        _meta: {
          value: {
            '': {
              err: [],
              rem: [],
              chunks: [],
            },
          },
        },
      });
      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );
      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: 'foo',
        })
      );
    });

    it('does not call render prop if required and value is falsy and no meta', () => {
      const obj = createEvent(null, {});

      mountWithTheme(
        <Annotated object={obj} objectKey="value" required>
          {mock}
        </Annotated>
      );

      expect(mock).not.toHaveBeenCalled();
    });
  });

  describe('with meta', () => {
    it('annotates errors', () => {
      const meta = {err: ['something']};
      const obj = createEvent('foo', meta);

      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );

      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: 'foo',
          meta: {
            chunks: [],
            rem: [],
            ...meta,
          },
        })
      );
    });

    it('annotates remarks and chunks', () => {
      const meta = {rem: [{type: 't'}], chunks: [{text: 'foo'}]};
      const obj = createEvent('foo', meta);

      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );

      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: 'foo',
          meta: {
            err: [],
            ...meta,
          },
        })
      );
    });

    it('annotates redacted text', () => {
      const meta = {err: ['something']};
      const obj = createEvent(null, meta);

      mountWithTheme(
        <Annotated object={obj} objectKey="value">
          {mock}
        </Annotated>
      );

      expect(mock.mock.calls[0][0].props).toEqual(
        expect.objectContaining({
          value: null,
          meta: {
            rem: [],
            chunks: [],
            ...meta,
          },
        })
      );
    });
  });
});
