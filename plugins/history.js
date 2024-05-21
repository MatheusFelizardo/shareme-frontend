export default defineNuxtPlugin((nuxtApp) => {
  const navigationHistory = reactive([]);

  nuxtApp.hook('page:finish', (component) => {
    const route = useRoute();
    navigationHistory.push({
      name: route.meta.breadcrumb || route.name,
      path: route.fullPath,
    });
  });

  nuxtApp.provide('navigationHistory', navigationHistory);
});