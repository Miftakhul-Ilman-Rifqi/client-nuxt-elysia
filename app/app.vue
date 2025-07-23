<!-- <template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template> -->

<template>
    <main class="min-h-screen bg-slate-100 flex items-center justify-center">
        <div
            class="bg-white rounded-xl shadow-2xl p-8 space-y-6 w-full max-w-md text-slate-800"
        >
            <h1 class="text-2xl font-bold text-center text-sky-700">
                🚀 Nuxt 4 × Bun Runtime demo
            </h1>

            <!-- Runtime card -->
            <div v-if="runtime" class="space-y-1">
                <h2 class="font-semibold text-lg">Runtime info</h2>
                <p><strong>Runtime:</strong> {{ runtime.runtime }}</p>
                <p><strong>Version:</strong> {{ runtime.version }}</p>
                <p><strong>Platform:</strong> {{ runtime.platform }}</p>
                <p class="text-xs text-slate-500">{{ runtime.timestamp }}</p>
            </div>

            <!-- Ping card -->
            <div v-if="ping" class="space-y-1">
                <h2 class="font-semibold text-lg">Ping</h2>
                <p>{{ ping.message }}</p>
                <p class="text-xs text-slate-500">{{ ping.timestamp }}</p>
            </div>

            <!-- Frontend runtime card -->
            <div class="space-y-1">
                <h2 class="font-semibold text-lg">Frontend runtime</h2>
                <p>{{ frontendRuntime }}</p>
            </div>

            <!-- Loading / error -->
            <div v-if="pending" class="text-center text-sky-600">Loading…</div>
            <div v-if="error" class="text-center text-red-600">{{ error }}</div>
        </div>
    </main>
</template>

<script setup lang="ts">
import type { RuntimeInfo, PingInfo } from "~/types/api";

const {
    data: runtime,
    pending: rPending,
    error: rError,
} = await useFetch<RuntimeInfo>(
    "https://server-nuxt-elysia.vercel.app/api/v1/runtime"
);

const {
    data: ping,
    pending: pPending,
    error: pError,
} = await useFetch<PingInfo>(
    "https://server-nuxt-elysia.vercel.app/api/v1/ping"
);

// --- Detect the *frontend* runtime (Bun vs Node) ---
// const frontendRuntime =
//     typeof (globalThis as any).Bun !== "undefined"
//         ? `Bun ${(globalThis as any).Bun.version}`
//         : "Node.js";
// Get detailed frontend runtime information
const frontendRuntime = computed(() => {
    if (typeof (globalThis as any).Bun !== "undefined") {
        return {
            runtime: "Bun",
            version: (globalThis as any).Bun.version,
            platform:
                (globalThis as any).Bun.env?.OS ||
                navigator.platform ||
                "unknown",
        };
    } else if (typeof process !== "undefined" && process.versions?.node) {
        return {
            runtime: "Node.js",
            version: process.versions.node,
            platform: process.platform || navigator.platform || "unknown",
        };
    } else {
        return {
            runtime: "Browser",
            version:
                navigator.userAgent
                    .split(" ")
                    .find(
                        (part) =>
                            part.includes("Chrome") ||
                            part.includes("Firefox") ||
                            part.includes("Safari")
                    ) || "unknown",
            platform: navigator.platform || "unknown",
        };
    }
});

const pending = computed(() => rPending.value || pPending.value);
const error = computed(() => rError.value || pError.value);
</script>
