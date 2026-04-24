<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";
    import type { Writable } from "svelte/store";

  export let handleInput: FormEventHandler<HTMLInputElement>;
  export let input: Writable<string>;
</script>

<input
  autofocus
  class="font-mono inline-flex rounded-[.25rem] text-accent text-[1rem] p-[.3125rem_.625rem] rounded-[.3125rem] text-accent bg-accent-bg border-[.125rem] border-transparent transition duration-300 outline-offset-[.125rem] hover:border-accent-border focus-visible:outline-[.125rem] focus-visible:outline-accent active:relative active:bottom-[-.0625rem] disabled:text-accent-disabled disabled:bg-accent-bg-disabled disabled:hover:border-transparent disabled:active:static  w-[3.4375rem] text-center"
  maxlength="3"
  bind:value={$input}
  on:input|trusted={handleInput}
/>