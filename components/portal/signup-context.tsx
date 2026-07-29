'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  activateUserAfterPayment,
  registerUser,
  type PortalUser,
  type RegisterUserInput,
} from '@/lib/portal/users';
import {
  getSubscriptionCheckoutAmount,
  getSubscriptionPlan,
  type SubscriptionPlan,
} from '@/lib/portal/subscription-plans';
import { persistMemberSession } from '@/lib/portal/auth-session';
import { buildSubscriptionCheckoutUrl } from '@/lib/portal/payments';

type SignupContextValue = {
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  selectedPlan: SubscriptionPlan;
  checkoutAmount: ReturnType<typeof getSubscriptionCheckoutAmount>;
  pendingUser: PortalUser | null;
  registerAndGoToCheckout: (input: Omit<RegisterUserInput, 'planId'>) => Promise<string>;
  completeSimulatedPayment: (opts: {
    userId?: string;
    planId?: string;
    amount?: number;
  }) => PortalUser | null;
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [selectedPlanId, setSelectedPlanId] = useState('individual');
  const [pendingUser, setPendingUser] = useState<PortalUser | null>(null);

  const selectedPlan = useMemo(() => getSubscriptionPlan(selectedPlanId), [selectedPlanId]);
  const checkoutAmount = useMemo(
    () => getSubscriptionCheckoutAmount(selectedPlanId),
    [selectedPlanId],
  );

  const registerAndGoToCheckout = useCallback(
    async (input: Omit<RegisterUserInput, 'planId'>) => {
      const user = registerUser({ ...input, planId: selectedPlanId });
      setPendingUser(user);
      persistMemberSession(user);

      await fetch('/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: input.password,
          name: user.name,
        }),
      });

      return buildSubscriptionCheckoutUrl(user.planId, checkoutAmount.total);
    },
    [selectedPlanId, checkoutAmount.total],
  );

  const completeSimulatedPayment = useCallback(
    (opts: { userId?: string; planId?: string; amount?: number }) => {
      const userId =
        opts.userId ||
        pendingUser?.id ||
        (typeof window !== 'undefined'
          ? window.localStorage.getItem('villanova_portal_current_user_id')
          : null);

      if (!userId) return null;

      const activated = activateUserAfterPayment(userId, {
        planId: opts.planId,
        amountPaid: opts.amount,
      });
      if (!activated) return null;

      setPendingUser(activated);
      persistMemberSession(activated);
      return activated;
    },
    [pendingUser],
  );

  const value = useMemo(
    () => ({
      selectedPlanId,
      setSelectedPlanId,
      selectedPlan,
      checkoutAmount,
      pendingUser,
      registerAndGoToCheckout,
      completeSimulatedPayment,
    }),
    [
      selectedPlanId,
      selectedPlan,
      checkoutAmount,
      pendingUser,
      registerAndGoToCheckout,
      completeSimulatedPayment,
    ],
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignupFlow() {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error('useSignupFlow must be used within SignupProvider');
  }
  return ctx;
}
