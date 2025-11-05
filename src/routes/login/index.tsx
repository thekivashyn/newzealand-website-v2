import { component$ } from '@builder.io/qwik';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInitializer } from '../../components/auth/AuthInitializer';

export default component$(() => {
  return (
    <>
      <AuthInitializer />
      <AuthLayout />
    </>
  );
});
