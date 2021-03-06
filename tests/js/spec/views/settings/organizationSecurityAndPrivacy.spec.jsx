import {mountWithTheme} from 'sentry-test/enzyme';
import {initializeOrg} from 'sentry-test/initializeOrg';
import {mountGlobalModal} from 'sentry-test/modal';

import OrganizationSecurityAndPrivacy from 'sentry/views/settings/organizationSecurityAndPrivacy';

describe('OrganizationSecurityAndPrivacy', function () {
  let organization;
  let routerContext;

  beforeEach(function () {
    ({organization, routerContext} = initializeOrg());
    MockApiClient.addMockResponse({
      url: `/organizations/${organization.slug}/auth-provider/`,
      method: 'GET',
    });

    MockApiClient.addMockResponse({
      url: `/organizations/${organization.slug}/`,
      method: 'GET',
    });
  });

  it('shows require2fa switch', async function () {
    const wrapper = mountWithTheme(
      <OrganizationSecurityAndPrivacy
        params={{orgId: organization.slug}}
        organization={organization}
      />,
      routerContext
    );
    await tick();
    wrapper.update();
    expect(wrapper.find('Switch[name="require2FA"]')).toHaveLength(1);
  });

  it('returns to "off" if switch enable fails (e.g. API error)', async function () {
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/',
      method: 'PUT',
      statusCode: 500,
    });

    const wrapper = mountWithTheme(
      <OrganizationSecurityAndPrivacy
        params={{orgId: organization.slug}}
        organization={organization}
      />,
      routerContext
    );

    await tick();
    wrapper.update();
    wrapper.find('Switch[name="require2FA"]').simulate('click');

    // hide console.error for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Confirm but has API failure
    const modal = await mountGlobalModal();
    modal.find('Button[priority="primary"]').simulate('click');

    await tick();
    wrapper.update();
    expect(wrapper.find('Switch[name="require2FA"]').prop('isActive')).toBe(false);
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  it('renders join request switch', async function () {
    const wrapper = mountWithTheme(
      <OrganizationSecurityAndPrivacy params={{orgId: organization.slug}} />,
      TestStubs.routerContext([{organization}])
    );

    await tick();
    wrapper.update();
    expect(wrapper.find('Switch[name="allowJoinRequests"]').exists()).toBe(true);
  });

  it('enables require2fa but cancels confirm modal', async function () {
    const mock = MockApiClient.addMockResponse({
      url: '/organizations/org-slug/',
      method: 'PUT',
    });
    const wrapper = mountWithTheme(
      <OrganizationSecurityAndPrivacy
        params={{orgId: organization.slug}}
        organization={organization}
      />,
      routerContext
    );

    await tick();
    wrapper.update();
    expect(wrapper.find('Switch[name="require2FA"]')).toHaveLength(1);
    wrapper.find('Switch[name="require2FA"]').simulate('click');

    // Cancel
    const modal = await mountGlobalModal();
    modal.find('Button').first().simulate('click');

    await tick();
    wrapper.update();

    expect(wrapper.find('Switch[name="require2FA"]').prop('isActive')).toBe(false);
    expect(mock).not.toHaveBeenCalled();
  });

  it('enables require2fa with confirm modal', async function () {
    const mock = MockApiClient.addMockResponse({
      url: '/organizations/org-slug/',
      method: 'PUT',
    });

    const wrapper = mountWithTheme(
      <OrganizationSecurityAndPrivacy
        params={{orgId: organization.slug}}
        organization={organization}
      />,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(wrapper.find('Switch[name="require2FA"]')).toHaveLength(1);
    wrapper.find('Switch[name="require2FA"]').simulate('click');

    // Confirm
    const modal = await mountGlobalModal();
    modal.find('Button[priority="primary"]').simulate('click');

    await tick();
    wrapper.update();

    expect(wrapper.find('Switch[name="require2FA"]').prop('isActive')).toBe(true);
    expect(mock).toHaveBeenCalledWith(
      '/organizations/org-slug/',
      expect.objectContaining({
        method: 'PUT',
        data: {
          require2FA: true,
        },
      })
    );
  });
});
