export default defineNuxtRouteMiddleware(async () => {
  // Ensure middleware runs only on the client side
  if (import.meta.server) return;

  const { cookieConfig } = useRuntimeConfig().public;

  const sid = useCookie("sid", cookieConfig).value;

  if (!sid) {
    // Redirect to login page if no access token
    return navigateTo({ name: "index" });
  }
});
