import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <p className="text-6xl font-bold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Página não encontrada</h1>
      <p className="mt-2 text-sm text-gray-500">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Voltar ao início
      </Link>
    </div>
  );
}
