import { component$, Slot } from '@builder.io/qwik';
import { Sidebar } from '../Sidebar';
import { MainContentWrapper } from '../MainContentWrapper';
import { MobileMenuButton } from '../ui/MobileMenuButton';

export const AppLayout = component$(() => {
  return (
    <div class="flex h-screen">
      <Sidebar />
      <MobileMenuButton />
      <MainContentWrapper>
        <Slot />
      </MainContentWrapper>
    </div>
  );
});

