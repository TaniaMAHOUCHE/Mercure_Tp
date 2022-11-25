<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\ChatRepository;
use App\Service\TopicHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ChatController extends AbstractController
{
    #[Route('/chat/{topic}', name: 'chat_getMessages', methods: 'GET')]
    /** @var $user ?User */
    public function getChatMessages(ChatRepository $chatRepository,
    Request $request, TopicHelper $topicHelper, string $topic): JsonResponse
    {
        $user = $this->getUser();

        if (!$topicHelper->isUserInThisTopic($user->getId(), $topic)) {
            return $this->json([
                'status' => 0,
                'error' => "Cet utilisateur n'a pas accès à ce topic"
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $messageList = ['chat' => $chatRepository->getAllMessagesOrderByDate($topic)];

        return $this->json($messageList, 200, [], ['groups' => 'main']);
    }

    #[Route('/chat/post-message', name: 'chat_postMessages', methods: 'POST')]
    /** @var $user ?User */

    public function postMessage(Request $request, ChatRepository $chatRepository, EntityManagerInterface $entityManager, TopicHelper $topicHelper): JsonResponse
    {
        $user = $this->getUser();
        $request = json_decode($request->getContent(), true);
        $topic = $request["topic"];

        $chat = $chatRepository->findOneBy(['topic' => $topic]);
        // dd($chat);

        if (!$chat) {
            $chat = new Chat();
            $chat->setTopic($topic);
            $entityManager->persist($chat);
        }

        $content = $request["content"];

        try {
            if (!$topicHelper->isUserInThisTopic($user->getId(), $topic)) {
                return $this->json([
                    'status' => 0,
                    'error' => "Cet utilisateur n'a pas accès à ce topic"
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $message = new Message();
            $message->setAuthor($user)
                    ->setChat($chat)
                    ->setDate(new \DateTime('',new \DateTimeZone('Europe/Paris')))
                    ->setContent($content);

            $entityManager->persist($message);
            $entityManager->flush();

            return $this->json([
                'status' => 1,
                'message' => "Le message a été envoyé !"
            ], Response::HTTP_CREATED);

        } catch (\Exception $exception) {
            return $this->json([
                'status' => 0,
                'error' => $exception->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
