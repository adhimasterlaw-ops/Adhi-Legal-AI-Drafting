export function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes("invalid login")) return "Email atau password salah.";
  if (value.includes("already registered") || value.includes("already been registered"))
    return "Email ini sudah terdaftar. Silakan login.";
  if (value.includes("rate limit") || value.includes("too many"))
    return "Terlalu banyak permintaan. Tunggu beberapa menit dan coba lagi.";
  if (value.includes("password")) return "Password belum memenuhi ketentuan keamanan.";
  return "Terjadi kendala. Silakan coba lagi.";
}
