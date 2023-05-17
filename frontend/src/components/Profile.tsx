"use client";
import { Account } from "../components/Account";
import { Connect } from "../components/Connect";
import { Connected } from "../components/Connected";
import { NetworkSwitcher } from "../components/NetworkSwitcher";

export function Profile() {
  return (
    <>
      <h1>Mass Market</h1>
      <Connect />
      <Connected>
        <Account />
        <hr />
        <NetworkSwitcher />
      </Connected>
    </>
  );
}

export default Profile;
