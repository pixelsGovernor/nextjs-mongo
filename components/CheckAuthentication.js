import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import dynamic from 'next/dynamic';

function CheckAuthentication({ redirect = '/' }) {
  const router = useRouter();
  const { state} = useContext(Store);
  const { userInfo} = state;
  if (!userInfo) {
    router.push(`login?redirect=${redirect}`);
  }
  return (
    <span></span>
  );
}

export default dynamic(() => Promise.resolve(CheckAuthentication), { ssr: false })
