// Common disposable/throwaway email providers.
// Kept lean — covers the vast majority of abuse cases.
const THROWAWAY_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.biz', 'guerrillamail.info', 'guerrillamailblock.com',
  'grr.la', 'sharklasers.com', 'spam4.me', 'trashmail.com', 'trashmail.net',
  'trashmail.org', 'trashmail.at', 'trashmail.io', 'trashmail.me',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.de',
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf',
  'monemail.fr.nf', 'monmail.fr.nf',
  'temp-mail.org', 'temp-mail.ru', 'tempmail.com', 'tempmail.net', 'tempmail.org',
  'tempr.email', 'dispostable.com', 'fakeinbox.com', 'maildrop.cc',
  'mailnull.com', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'throwam.com', 'throwam.net', 'harakirimail.com', 'getairmail.com',
  'mohmal.com', 'mailnesia.com', 'mailnew.com', 'spamfree24.org',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.net', 'spamfree24.info',
  'mytempemail.com', 'tempinbox.com', 'spamevader.com', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'emailondeck.com', 'discardmail.com',
  'discardmail.de', 'spamgrap.com', 'owlpic.com', 'spamherelots.com',
  'spoofmail.de', 'filzmail.com', 'gowikibooks.com', 'gowikicampus.com',
  'gowikicars.com', 'gowikifilms.com', 'gowikigames.com', 'gowikimusic.com',
  'gowikitravel.com', 'gowikitv.com', 'inoutmail.eu', 'inoutmail.info',
  'crazymailing.com', 'despam.it', 'discard.email', 'mt2015.com',
]);

export function isThrowawayDomain(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return THROWAWAY_DOMAINS.has(domain);
}
