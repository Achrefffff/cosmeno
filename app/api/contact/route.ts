import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate email
    const toEmail = process.env.CONTACT_EMAIL;
    if (!toEmail) {
      console.error("CONTACT_EMAIL n'est pas défini dans les variables d'environnement.");
      return NextResponse.json(
        { error: "Configuration email manquante." },
        { status: 500 }
      );
    }

    // Prepare email content based on form data
    const { 
      profile, 
      profileName,
      firstName, 
      lastName, 
      company, 
      phone, 
      email, 
      vision,
      answers
    } = data;

    // Construct the email body
    let emailText = `Nouvelle demande de contact depuis le site Cosmenova\n\n`;
    emailText += `--- Profil ---\n`;
    emailText += `Type: ${profileName}\n\n`;

    emailText += `--- Coordonnées ---\n`;
    emailText += `Prénom: ${firstName}\n`;
    emailText += `Nom: ${lastName}\n`;
    if (company) emailText += `Société: ${company}\n`;
    emailText += `Email: ${email}\n`;
    emailText += `Téléphone: ${phone}\n\n`;

    emailText += `--- Projet ---\n`;
    if (answers) {
      for (const [question, answer] of Object.entries(answers)) {
        emailText += `${question}: ${answer}\n`;
      }
    }
    emailText += `\n`;

    emailText += `--- Vision ---\n`;
    emailText += `${vision || 'Non renseignée'}\n`;

    // Send email using Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'Cosmenova <onboarding@resend.dev>', // Use a verified domain or resend testing email
      to: [toEmail],
      subject: `Nouveau contact: ${firstName} ${lastName} - ${profileName}`,
      text: emailText,
      replyTo: email,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: resendData });

  } catch (error) {
    console.error("Erreur API Contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
