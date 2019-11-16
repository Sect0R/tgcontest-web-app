function MtpSecureRandomModule() {
    window.addEventListener('keydown', rng_seed_time);
    window.addEventListener('click', rng_seed_time);
    return new SecureRandom();
}
