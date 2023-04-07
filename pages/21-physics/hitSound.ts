export const hitSound = new Audio("/sounds/hit.mp3");

export function playHitSound(collision) {
  const impactStrengh = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrengh <= 1.5) return;
  //   hitSound.volume = impactStrengh * 0.1;
  hitSound.currentTime = 0;
  hitSound.play();
}
