/* eslint-disable no-console */

import {
  BASE_URL,
  LOCKOUT_EMAIL,
  LOCKOUT_PASSWORD,
  LOCKOUT_WRONG_PASSWORD,
  RUN_GOOGLE,
  RUN_LOCKOUT,
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_SIGNUP_PASSWORD,
} from "./smoke.config";
import { request } from "./smoke.request";
import type {
  ApiResponse,
  AuthUser,
  LoginSuccess,
  SignupSuccess,
  TestResult,
} from "./smoke.types";
import {
  assert,
  clearCookies,
  hasCookie,
  logResponse,
  logStep,
  printSummary,
  runTest,
  uniqueEmail,
} from "./smoke.utils";

const results: TestResult[] = [];

async function testSignupAndDuplicate(): Promise<void> {
  const email = uniqueEmail("smoke_signup");

  logStep("signup creates a new account");
  clearCookies();

  const signup = await request<ApiResponse<SignupSuccess>>("auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password: TEST_SIGNUP_PASSWORD,
    }),
  });

  logResponse(signup.res, signup.body, signup.text);

  assert(signup.res.status === 200, "Signup should return 200");
  assert(signup.body?.ok === true, "Signup should return ok=true");

  const user = signup.body.data.user;

  assert(user.email === email.toLowerCase(), "Signup email should match");
  assert(Boolean(user.id), "Signup should return a user id");
  assert(Boolean(user.username), "Signup should return a username");

  logStep("signup rejects duplicate email");
  clearCookies();

  const duplicate = await request<ApiResponse<SignupSuccess>>("auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password: TEST_SIGNUP_PASSWORD,
    }),
  });

  logResponse(duplicate.res, duplicate.body, duplicate.text);

  assert(duplicate.res.status === 409, "Duplicate signup should return 409");
  assert(
    duplicate.body?.ok === false,
    "Duplicate signup should return ok=false",
  );
  assert(
    duplicate.body.error.code === "AUTH_EMAIL_ALREADY_EXISTS",
    "Duplicate signup should return AUTH_EMAIL_ALREADY_EXISTS",
  );
}

async function testInvalidLoginUnknownUser(): Promise<void> {
  logStep("login rejects unknown identifier with generic failure");
  clearCookies();

  const res = await request<ApiResponse<LoginSuccess>>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: uniqueEmail("missing_user"),
      password: "wrong-password",
    }),
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 401, "Unknown login should return 401");
  assert(res.body?.ok === false, "Unknown login should return ok=false");
  assert(
    res.body.error.code === "AUTH_INVALID_CREDENTIALS",
    "Unknown login should return AUTH_INVALID_CREDENTIALS",
  );
}

async function testInvalidLoginWrongPassword(): Promise<void> {
  logStep("login rejects wrong password with generic failure");
  clearCookies();

  const res = await request<ApiResponse<LoginSuccess>>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: TEST_EMAIL,
      password: `${TEST_PASSWORD}_wrong`,
    }),
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 401, "Wrong-password login should return 401");
  assert(res.body?.ok === false, "Wrong-password login should return ok=false");
  assert(
    res.body.error.code === "AUTH_INVALID_CREDENTIALS",
    "Wrong-password login should return AUTH_INVALID_CREDENTIALS",
  );
}

async function testMeProfileAuthenticated(): Promise<void> {
  logStep("/protected/me/profile returns authenticated user");

  const res = await request<ApiResponse<{ user: AuthUser }>>(
    "protected/me/profile",
    { method: "GET" },
  );

  logResponse(res.res, res.body, res.text);

  assert(
    res.res.status === 200,
    "/protected/me/profile should return 200 after login",
  );
  assert(res.body?.ok === true, "/protected/me/profile should return ok=true");
}

async function testMeProfileUnauthorized(): Promise<void> {
  logStep("/protected/me/profile is unauthorized without session");
  clearCookies();

  const res = await request<ApiResponse<unknown>>("protected/me/profile", {
    method: "GET",
  });

  logResponse(res.res, res.body, res.text);

  assert(
    res.res.status === 401,
    "/protected/me/profile should return 401 without session",
  );
  assert(
    res.body?.ok === false,
    "/protected/me/profile should return ok=false without session",
  );
}

async function testValidLoginLogoutRelogin(): Promise<void> {
  logStep("login succeeds and sets a session cookie");
  clearCookies();

  const login = await request<ApiResponse<LoginSuccess>>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  logResponse(login.res, login.body, login.text);

  assert(login.res.status === 200, "Valid login should return 200");
  assert(login.body?.ok === true, "Valid login should return ok=true");
  assert(hasCookie("sid"), "Valid login should set sid cookie");

  await testMeProfileAuthenticated();

  logStep("logout succeeds");

  const logout = await request<ApiResponse<null>>("auth/logout", {
    method: "POST",
  });

  logResponse(logout.res, logout.body, logout.text);

  assert(logout.res.status === 200, "Logout should return 200");
  assert(logout.body?.ok === true, "Logout should return ok=true");

  logStep("/protected/me/profile is unauthorized after logout");

  const afterLogout = await request<ApiResponse<unknown>>(
    "protected/me/profile",
    { method: "GET" },
  );

  logResponse(afterLogout.res, afterLogout.body, afterLogout.text);

  assert(
    afterLogout.res.status === 401,
    "/protected/me/profile should return 401 after logout",
  );

  logStep("login still works after logout");
  clearCookies();

  const relogin = await request<ApiResponse<LoginSuccess>>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  logResponse(relogin.res, relogin.body, relogin.text);

  assert(relogin.res.status === 200, "Relogin should return 200");
  assert(relogin.body?.ok === true, "Relogin should return ok=true");
}

async function testLockout(): Promise<void> {
  logStep("lockout triggers after repeated failed logins");
  clearCookies();

  for (let i = 1; i <= 5; i++) {
    const res = await request<ApiResponse<LoginSuccess>>("auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: LOCKOUT_EMAIL,
        password: LOCKOUT_WRONG_PASSWORD,
      }),
    });

    console.log(`\nattempt ${i}`);
    logResponse(res.res, res.body, res.text);

    assert(
      res.res.status === 401,
      `Lockout setup attempt ${i} should return 401`,
    );
    assert(
      res.body?.ok === false,
      `Lockout setup attempt ${i} should return ok=false`,
    );
    assert(
      res.body.error.code === "AUTH_INVALID_CREDENTIALS",
      `Lockout setup attempt ${i} should return AUTH_INVALID_CREDENTIALS`,
    );
  }

  const locked = await request<ApiResponse<LoginSuccess>>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: LOCKOUT_EMAIL,
      password: LOCKOUT_PASSWORD,
    }),
  });

  console.log("\npost-lock valid-password attempt");
  logResponse(locked.res, locked.body, locked.text);

  assert(
    locked.res.status === 401 || locked.res.status === 403,
    "Locked account should return 401 or 403 depending on API policy",
  );
  assert(locked.body?.ok === false, "Locked account should return ok=false");

  const errorCode = locked.body.error.code;

  assert(
    errorCode === "AUTH_INVALID_CREDENTIALS" ||
      errorCode === "AUTH_ACCOUNT_LOCKED",
    "Locked account should return AUTH_INVALID_CREDENTIALS or AUTH_ACCOUNT_LOCKED",
  );
}

async function testGoogleEntrypoint(): Promise<void> {
  logStep("google auth entrypoint redirects");
  clearCookies();

  const res = await request<unknown>("auth/google", {
    method: "GET",
  });

  logResponse(res.res, res.body, res.text);

  assert(
    res.res.status === 302 || res.res.status === 303,
    "Google auth entrypoint should redirect",
  );

  const location = res.res.headers.get("location") ?? "";
  assert(
    location.length > 0,
    "Google auth entrypoint should include Location header",
  );
}

async function main(): Promise<void> {
  console.log("Auth smoke suite starting");
  console.log("BASE_URL:", BASE_URL);
  console.log("TEST_EMAIL:", TEST_EMAIL);
  console.log("LOCKOUT_EMAIL:", LOCKOUT_EMAIL);

  await runTest(results, "signup + duplicate signup", testSignupAndDuplicate);
  await runTest(
    results,
    "invalid login - unknown user",
    testInvalidLoginUnknownUser,
  );
  await runTest(
    results,
    "invalid login - wrong password",
    testInvalidLoginWrongPassword,
  );
  await runTest(
    results,
    "/protected/me/profile unauthorized",
    testMeProfileUnauthorized,
  );
  await runTest(
    results,
    "valid login + logout + relogin",
    testValidLoginLogoutRelogin,
  );

  if (RUN_LOCKOUT) {
    await runTest(results, "lockout flow", testLockout);
  } else {
    console.log("\n=== lockout skipped ===");
    console.log(
      "Set RUN_LOCKOUT=true to include the destructive lockout flow.",
    );
  }

  if (RUN_GOOGLE) {
    await runTest(results, "google entrypoint redirect", testGoogleEntrypoint);
  } else {
    console.log("\n=== google flow skipped ===");
    console.log(
      "Set RUN_GOOGLE=true to verify the Google redirect entrypoint.",
    );
  }

  printSummary(results);

  const hasFailures = results.some((result) => !result.ok);
  if (hasFailures) process.exit(1);
}

main().catch((error) => {
  console.error("\nSmoke suite crashed");
  console.error(error);
  process.exit(1);
});
