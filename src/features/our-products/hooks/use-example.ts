import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * ini namanya bikin custom hook
 * custom hook itu fungsinya buat nampung logic yang bisa dipake di banyak tempat
 * custom hook namanya harus diawali "use" biar React tau ini hook
 */
export function useExample() {
  /**
   * simpen state, bisa dipake di client component aja
   * state ini namanya "example", fungsinya buat nampung teks
   * "setExample" itu fungsinya buat update state "example" tadi
   * defaultnya state "example" itu isinya string kosong
   * kalo mau bikin state yang isinya number, defaultnya harus 0
   * kalo mau bikin state yang isinya array, defaultnya harus []
   * kalo mau bikin state yang isinya object, defaultnya harus {}
   */
  const [example, setExample] = useState("");

  /**
   * ambil state dan tambahkan " kata" di belakangnya
   * useMemo itu fungsinya buat ngehindarin kalkulasi ulang kalo dependensi (example) gak berubah
   * jadi kalo "example" gak berubah, "examplePlusKata" juga gak bakal berubah
   */
  const examplePlusKata = useMemo(() => example + " kata", [example]);

  /**
   * jalankan logic per render/mount component
   * karena dependensinya kosong, jadi ini cuma jalan sekali doang pas component pertama kali dimount
   * kalo ada dependensi, logic ini bakal jalan tiap kali dependensi itu berubah
   */
  useEffect(() => {
    console.log("example useEffect jalan");
  }, []);

  /**
   * jalankan logic tiap kali example berubah
   * karena dependensinya "example", jadi ini bakal jalan tiap kali "example" berubah
   * kalo mau bikin useEffect yang jalan tiap kali "examplePlusKata" berubah, tinggal ganti dependensinya aja
   */
  useEffect(() => {
    console.log("Cuma jalan ketika example berubah:", example);
  }, [example]);

  /**
   * contoh useEffect yang dependensinya "examplePlusKata"
   * ini bakal jalan tiap kali "examplePlusKata" berubah
   * jadi kalo "example" berubah, "examplePlusKata" juga bakal berubah, dan ini bakal jalan
   * tapi kalo "example" gak berubah, "examplePlusKata" juga gak bakal berubah, dan ini gak bakal jalan
   * jadi ini contohnya aja, gak dipake di mana-mana
   * bisa dihapus kalo mau
   */
  useEffect(() => {
    console.log("Atau ketika examplePlusKata berubah:", examplePlusKata);
  }, [examplePlusKata]);

  /**
   * contoh function buat reset state
   * ini contohnya aja, gak dipake di mana-mana
   * bisa dihapus kalo mau
   */
  function resetExample() {
    setExample("");
  }

  /**
   * contoh function yang nge-log state ke console
   * pake useCallback biar gak bikin function baru tiap render
   * dependensinya "example", jadi kalo "example" berubah, function ini bakal dibuat ulang
   * ini contohnya aja, gak dipake di mana-mana
   * bisa dihapus kalo mau
   */
  const logExample = useCallback(() => {
    console.log("Current example value:", example);
  }, [example]);

  /**
   * balikin state dan function buat update state
   * bisa ditambahin function lain juga kalo perlu
   * nanti di component yang pake hook ini, tinggal panggil aja functionnya
   */
  return {
    /**
     * langsung return aja tanpa simpen di variable
     */
    logExample,

    /**
     * bisa juga gini, simpen di variable dulu baru return
     */
    exampleText: example,
    setExampleText: setExample,
    resetExampleText: resetExample,
  };
}
