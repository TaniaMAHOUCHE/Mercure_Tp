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
use Doctrine\Persistence\ManagerRegistry;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Bundle\MercureBundle\Mercure;
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

    public function postMessage( HubInterface $hub, Request $request, ChatRepository $chatRepository, EntityManagerInterface $entityManager, TopicHelper $topicHelper): JsonResponse
    {
        $user = $this->getUser();
        $request = json_decode($request->getContent(), true);
        $topic = $request["topic"];

        $chat = $chatRepository->findOneBy(['topic' => $topic]);

        if (!$chat) {
            $chat = new Chat();
            $chat->setTopic($topic);
            $entityManager->persist($chat);
        }

        $content = $request["message"];


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


            $update = new Update(
                [
                    "https://example.com/my-private-topic",
                    "https://example.com/user/{$user->getId()}/?topic=" . urlencode("https://example.com/my-private-topic")
                ],
                json_encode([
                    'user' => $user->getUsername(),
                    'id' => $user->getId()
                ]),
                true
            );
    
            $hub->publish($update);

            return $this->json([
                'status' => 1,
                'message' => "Le message a été envoyé !"
            ], Response::HTTP_CREATED);

        } 
        catch (\Exception $exception) {
            return $this->json([
                'status' => 0,
                'error' => $exception->getMessage(),
                // 'file' => $exception->getFile(),
                // 'line' => $exception->getLine(),
                // 'code' => $exception->getCode(),
                // 'previous' => $exception->getPrevious(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new Response('Message envoyé!');
    }

    #[Route('/message/{userId}', name: 'ping_user', methods: 'POST' )]
    public function pingUser(HubInterface $hub ,ManagerRegistry $doctrine, int $userId , Request $request)
    {
        $user = $this->getUser();
        $userToTalk = $doctrine->getRepository(User::class)->findOneBy(['id' =>  $userId]) ;


        $requestElement = json_decode($request->getContent(), true);
        $requestElement["message"] ;


        if (!$userToTalk) {
            throw $this->createNotFoundException(
                'No user found for id '.$userId 
            );
        }
                 
        $update = new Update(
            [ 
            "https://example.com/my-private-topic/". $userToTalk->getId()
            ],
            json_encode([
                'username' => $userToTalk->getUsername(),
                'userId' => $userToTalk->getId()
            ]),
            true
        );
 

        $hub->publish($update) ;

        return $this->json([
            'message' => 'Message envoyé',
        ], 200);    
    }



    #[Route('/publish-post/{userId}', name: 'publish', methods: 'POST' )]
    public function publishPost( 
        Request $request,
        HubInterface $hub ,
        ChatRepository $chatRepository,
        TopicHelper $topicHelper,
        EntityManagerInterface $entityManager,
        ManagerRegistry $doctrine,
        int $userId
        )
    {
   
        $request = json_decode($request->getContent(), true);
        $topicId = $request["topic"];
        $messageContent = $request["message"];
        $user = $this->getUser();
        // currrent user @ destinanatire
        $creatTopic = $user->getId().'@'.$topicId;
        $userToTalk = $doctrine->getRepository(User::class)->findOneBy(['id' =>  $userId]) ;


        if( !($topicId && $messageContent)){
            throw $this->createNotFoundException(
                'Informations are missing',
            );
        }

        $chat = $chatRepository->findOneBy(['topic' => $creatTopic]);

        if (!$chat) {
            $chat = new Chat();
            $chat->setTopic($creatTopic);
            $entityManager->persist($chat);
        }

   

        // if (!$topicHelper->isUserInThisTopic($user->getId(), $creatTopic)) {
        //     return $this->json([
        //         'status' => 0,
        //         'error' => "Cet utilisateur n'a pas accès à ce topic"
        //     ], Response::HTTP_UNPROCESSABLE_ENTITY);
        // }

        $message = new Message();
        $message->setAuthor($user)
                ->setChat($chat)
                ->setDate(new \DateTime('',new \DateTimeZone('Europe/Paris')))
                ->setContent($messageContent);

            $entityManager->persist($message);
            $entityManager->flush();

        
                          
        $update = new Update(
            [ 
            "https://example.com/my-private-topic/". $userToTalk->getId()
            ],
            json_encode([
                'desti' => $userToTalk->getId(),
                'data' => $messageContent,
            ]),
            true
        );
 

        $hub->publish($update) ;



        return $this->json([
            'message' => 'Message envoyé',
            'topic' => $creatTopic,
            'messsage' => $messageContent,
        ], 200);  



    }





}
