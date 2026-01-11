import axios from "axios";

export function useAuth() {
	const user = ref(null);
	const isLoading = ref(true);

	async function fetchSession() {
		isLoading.value = true;
		try {
			const { data } = await axios.get(
				"http://localhost:9999/api/auth/get-session",
				{
					withCredentials: true,
				},
			);
			user.value = data.user || null;
		} catch {
			user.value = null;
		} finally {
			isLoading.value = false;
		}
	}

	const isLoggedIn = computed(() => !!user.value);

	return {
		user,
		isLoggedIn,
		isLoading,
		fetchSession,
	};
}
